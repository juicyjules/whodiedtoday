import axios from 'axios';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

class WikipediaService {
  public async getRecentDeaths() {
    console.log('Fetching recent deaths from Wikipedia...');
    const recentChanges = await this.fetchRecentChanges();
    // TODO: Filter for deaths and parse data
    return recentChanges;
  }

  private async fetchRecentChanges() {
    const params = {
      action: 'query',
      list: 'recentchanges',
      rcprop: 'title|ids|user|comment|timestamp|sizes',
      rclimit: 50, // Fetch 50 recent changes
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
