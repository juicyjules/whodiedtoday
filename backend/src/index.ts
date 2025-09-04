import express from 'express';
import WikipediaService from './wikipedia.service';

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/health', (req, res) => {
  res.send('OK');
});

app.get('/api/deaths', async (req, res) => {
  try {
    const deaths = await WikipediaService.getDeaths();
    res.json(deaths);
  } catch (error) {
    console.error('Error fetching deaths from database:', error);
    res.status(500).send('Error fetching data');
  }
});

// --- Background Data Fetching ---

const WIKIPEDIA_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Function to perform the Wikipedia data update
const performUpdate = () => {
  console.log('Triggering periodic Wikipedia data update...');
  WikipediaService.updateRecentDeaths().catch(error => {
    console.error('Error during periodic Wikipedia data update:', error);
  });
};

// Set up the interval
setInterval(performUpdate, WIKIPEDIA_FETCH_INTERVAL);

// --- Server Startup ---

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // Initial data fetch on startup
  console.log('Performing initial data fetch on startup...');
  performUpdate();
});
