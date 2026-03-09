const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const { port } = require('./config');

const authRoutes = require('./routes/auth');
const touristRoutes = require('./routes/tourist');
const tripRoutes = require('./routes/trip');
const alertRoutes = require('./routes/alert');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require("./routes/userRoutes");


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/trip', tripRoutes);
app.use("/api/users", userRoutes);
app.use('/trips', tripRoutes);
app.use('/api/alert', alertRoutes);



app.use(errorHandler);
app.post('/api/groq/chat', async (req, res) => {
  const { prompt } = req.body;
  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI Travel Assistant for the TripSecure platform. You must ONLY answer questions directly related to travel, user safety, location information, and the TripSecure mobile/web app. If the user asks about anything unrelated to travel, tourism, or safety, politely decline to answer.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });
    const data = await groqRes.json();
    console.log('Groq API response:', data);

    if (data.error) {
      console.error('Groq API returned error:', data.error);
      return res.status(500).json({ response: `Groq API Error: ${data.error.message}` });
    }

    res.json({ response: data.choices?.[0]?.message?.content || '' });
  } catch (err) {
    console.error('Groq API error:', err);
    res.status(500).json({ response: 'Error contacting Groq API.' });
  }
});

async function init() {
  console.log('Backend initialized with Supabase.');
}
init().catch(err => console.error(err));

module.exports = app;

