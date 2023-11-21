const cron = require('node-cron');
// import cron from 'node-cron';
import RssFetcher from './RssFetcher';

const fetcher = new RssFetcher();

if (process.argv.includes('--run-scheduler')) {
    fetcher.fetchAllFeeds();
} else {
    // Cron to run every 10 minutes
    cron.schedule('*/10 * * * *', fetcher.fetchAllFeeds)

    // cron.schedule('0 0 * * *', fetcher.fetchAllFeeds); // Regular scheduling
}

// cron.schedule('0 */6 * * *', () => {  // Every 6 hours as an example
//     console.log('Running scheduled feed fetching...');
//     fetcher.fetchAllFeeds();
// });
