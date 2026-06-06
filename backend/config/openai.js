const { OpenAI } = require('openai');

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('WARNING: OPENAI_API_KEY is not defined in environment variables. AI features will run in mock mode.');
}

module.exports = openai;
