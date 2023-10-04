require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');
const winston = require('winston');
// Setup logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'twitter-bot' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Initialize Twitter client
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
// bearerToken: process.env.TWITTER_BEARER_TOKEN
});

const v2TwitterClient = new TwitterApi(process.env.BEARER_TOKEN);

// Initialize OpenAI client
const openai = new OpenAI({
    key: process.env.OPENAI_API_KEY,
});

async function checkTimeline() {
    try {
        const tweets = await twitterClient.v1.tweet("Hello");
        console.log(tweets)
        // for (const tweet of tweets.tweets) {
        //     // process tweet...
        //     const prompt = `The goal is to maximize engagement and relatability to monetize our Twitter account. Analyze the following tweet, and craft a response that is clever if the setting is right, humorous if it's appropriate, and knowledgeable if the tweet indicates a problem, ensuring the response is likely to resonate with a broad audience: "${tweetText}"`;

        //     try {
        //         const gptResponse = await openai.complete({
        //             prompt: prompt,
        //             max_tokens: 150,
        //             temperature: 0.7,
        //         });

        //         const gptReply = gptResponse.choices[0].text.trim();

        //         await v2TwitterClient.v2.reply(gptReply, tweet.id);
        //         lastSeenTweetId = tweet.id;
        //     } catch (error) {
        //         console.log('Error processing tweet:', error)
        //         logger.error('Error processing tweet:', error);
        //     }
        // }
    } catch (error) {
        console.log('Error checking timeline:', error)
        logger.error('Error checking timeline:', error);
    }
}

// Check the timeline every 5 minutes
checkTimeline()


// Start the Express server
app.listen(port, () => {
    console.log(`Bot is running on http://localhost:${port}`);
});
