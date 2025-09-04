import express from 'express';
import WikipediaService from './wikipedia.service';

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/health', (req, res) => {
  res.send('OK');
});

app.get('/api/deaths', async (req, res) => {
  const deaths = await WikipediaService.getRecentDeaths();
  res.json(deaths);
});

// Periodically fetch data in the background
const WIKIPEDIA_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
  console.log('Periodic fetch of Wikipedia data...');
  WikipediaService.getRecentDeaths();
}, WIKIPEDIA_FETCH_INTERVAL);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // Initial fetch on startup
  WikipediaService.getRecentDeaths();
});
