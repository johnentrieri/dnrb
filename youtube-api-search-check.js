const {youtube} = require('@googleapis/youtube');

// Get YouTube API Key from .env file
require('dotenv').config();
const ytAPIkey = process.env.YOUTUBE_API_KEY;

// Authorize using API Key, OAuth2 not required for public searches
const ytClient = youtube({ version: 'v3', auth: ytAPIkey });

// a very simple example of searching for youtube videos
async function searchYT(queryString,numResults) {
    const res = await ytClient.search.list({

        // For efficiency - only return ID and Snippet parts of SearchResult
        part: 'id,snippet',

        // Keyword to search
        q: queryString,
    });

    // Return a sliced array (only top N results)
    return (res.data.items.slice(0,numResults));
}

// Example execution - search and log top 3 results
searchYT('Diary of Jane',3).then( (results) => { console.log(results) });
 