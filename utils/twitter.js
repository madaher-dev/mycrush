var Twitter = require('twitter');

const consumer_key = process.env.ADMIN_TWITTER_API_KEY;
const consumer_token = process.env.ADMIN_TWITTER_API_SECRET;
const account_key = process.env.ADMIN_TWITTER_ACCESS_TOKEN;
const account_token = process.env.ADMIN_TWITTER_ACCESS_TOKEN_SECRET;
const endpoint = 'https://api.twitter.com/1.1/statuses/update.json';

const tweet = async username => {
  let result = { success: false, error: null };
  const URL = process.env.WEBSITE_URL;

  try {
    const params = {
      status: `Hey @${username} Something is cooking! Someone seems to have a crush on you. Visit MyCrush website, add a new crush and try to match with your secret admirer. Happy matching!`
    };
    var client = new Twitter({
      consumer_key: consumer_key,
      consumer_secret: consumer_token,
      access_token_key: account_key,
      access_token_secret: account_token
    });

    const result = await client.post(endpoint, params);
    return result;
  } catch (error) {
    console.log(error);
    result.error = error;
    return result;
  }
};
module.exports = tweet;
