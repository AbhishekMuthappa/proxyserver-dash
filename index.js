// 🌐 Simple Express Server to Proxy OpenAI Requests Securely

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 🔑 Store your OpenAI API Key in an environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful performance analysis assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    res.json({ answer: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to OpenAI API' });
  }
});

app.listen(port, () => {
  console.log(`OpenAI Proxy Server running on port ${port}`);
});
