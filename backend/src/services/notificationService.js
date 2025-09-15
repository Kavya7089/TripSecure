const axios = require('axios');
const { twilio } = require('../config');
// Simple SMS via Twilio or fall-back console.

async function sendSms(to, message) {
  if (!twilio.sid) {
    console.log(`MOCK SMS to ${to}: ${message}`);
    return { mock: true };
  }
  // if real Twilio: use axios or twilio library (omitted for brevity)
  const accountSid = twilio.sid, authToken = twilio.token;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const data = new URLSearchParams({ From: twilio.from, To: to, Body: message }).toString();
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const res = await axios.post(url, data, { headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' } });
  return res.data;
}

module.exports = { sendSms };
