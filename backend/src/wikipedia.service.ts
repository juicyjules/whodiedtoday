import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
const DEATH_KEYWORDS = ['died', 'death', 'obituary'];

const prisma = new PrismaClient();

export interface PersonData {
  name: string;
  imageUrl: string | null;
  bio: string | null;
  wikipediaUrl: string;
}

class WikipediaService {
  /**
   * Fetches deaths from the database.
   * @returns A list of people from the database.
   */
  public async getDeaths() {
    console.log('Fetching deaths from database...');
    return prisma.person.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Fetches recent changes from Wikipedia, identifies deaths, and stores them in the database.
   */
  public async updateRecentDeaths() {
    console.log('Starting Wikipedia data update...');
    const recentChanges = await this.fetchRecentChanges();

    const deathRelatedChanges = recentChanges.filter(change =>
      this.isDeathRelated(change.comment)
    );

    const uniqueTitles = [...new Set(deathRelatedChanges.map(c => c.title))];

    // Filter out titles that are already in the database
    const existingPeople = await prisma.person.findMany({
      where: { name: { in: uniqueTitles } },
      select: { name: true },
    });
    const existingNames = new Set(existingPeople.map(p => p.name));
    const newTitles = uniqueTitles.filter(title => !existingNames.has(title));

    if (newTitles.length === 0) {
      console.log('No new potential deaths found to process.');
      return;
    }

    console.log(`Found ${newTitles.length} new potential death-related articles to process.`);

    const peopleDataPromises = newTitles.map(title =>
      this.fetchPersonData(title).catch(error => {
        console.error(`Error processing page for ${title}:`, error);
        return null;
      })
    );

    const results = await Promise.all(peopleDataPromises);
    const newPeople = results.filter((data): data is PersonData => data !== null);

    if (newPeople.length > 0) {
      const { count } = await prisma.person.createMany({
        data: newPeople,
        skipDuplicates: true, // Should not be necessary due to above check, but good for safety
      });
      console.log(`Successfully saved ${count} new people to the database.`);
    } else {
      console.log('No new people to save to the database.');
    }
  }

  private isDeathRelated(comment: string): boolean {
    if (!comment) {
      return false;
    }
    const lowerCaseComment = comment.toLowerCase();
    return DEATH_KEYWORDS.some(keyword => lowerCaseComment.includes(keyword));
  }

  private async fetchPersonData(title: string): Promise<PersonData | null> {
    console.log(`Fetching page content for: ${title}`);
    const pageHtml = await this.fetchPageHtml(title);
    if (!pageHtml) {
      return null;
    }

    const $ = cheerio.load(pageHtml);

    // Basic validation to skip non-person articles
    const isDisambiguation = $('#disambigbox').length > 0;
    const isList = title.startsWith('List of') || title.startsWith('Deaths in');
    if (isDisambiguation || isList) {
      console.log(`Skipping page '${title}' as it is a disambiguation or list page.`);
      return null;
    }

    const name = title;
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g, '_'))}`;

    // Extract image from infobox
    let imageUrl = $('.infobox .infobox-image img').attr('src') || null;
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https:${imageUrl}`;
    }

    // Extract biography (first paragraph)
    const bio = $('#mw-content-text .mw-parser-output > p:not(:empty)').first().text().trim();

    if (!bio) {
        console.log(`Could not extract a biography for '${title}'. Skipping.`);
        return null;
    }

    return {
      name,
      imageUrl,
      bio,
      wikipediaUrl,
    };
  }

  private async fetchPageHtml(title: string): Promise<string | null> {
    const params = {
      action: 'parse',
      page: title,
      prop: 'text',
      format: 'json',
      formatversion: 2,
    };
    try {
      const response = await axios.get(WIKIPEDIA_API_URL, { params });
      // The actual content is in response.data.parse.text
      if (response.data.parse && response.data.parse.text) {
        return response.data.parse.text;
      }
      return null;
    } catch (error) {
      // Axios wraps error responses in a `response` object
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Error fetching page HTML for ${title}:`, error.response.data);
      } else {
        console.error(`Error fetching page HTML for ${title}:`, error);
      }
      return null;
    }
  }

  private async fetchRecentChanges() {
    const params = {
      action: 'query',
      list: 'recentchanges',
      rcprop: 'title|ids|user|comment|timestamp|sizes',
      rclimit: 200, // Increased limit to get a better sample
      rcshow: '!bot', // Exclude bots
      rctype: 'edit|new',
      format: 'json',
      formatversion: 2,
    };

    try {
      const response = await axios.get(WIKIPEDIA_API_URL, { params });
      return response.data.query.recentchanges;
    } catch (error) {
      console.error('Error fetching recent changes from Wikipedia:', error);
      return [];
    }
  }
}

export default new WikipediaService();
