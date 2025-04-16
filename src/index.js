const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let rsvpMap = new Map();

app.post('/api/rsvp', (req, res) => {
  const { id, name, status } = req.body;
  if (!id || !name || !status) {
    return res.status(400).json({ message: "Missing fields" });
  }
  rsvpMap.set(id, { id, name, status });
  res.json({ message: 'RSVP saved' });
});

app.get('/api/rsvps', (req, res) => {
  const list = Array.from(rsvpMap.values());
  res.json(list);
});

app.listen(port, () => {
  console.log(`RSVP backend running at http://localhost:${port}`);
});

// Get confirmed attendees
app.get('/api/rsvps/confirmed', (req, res) => {
  const confirmed = Array.from(rsvpMap.values()).filter(entry => entry.status === 'Yes');
  res.json(confirmed);
});

// Get RSVP counts
app.get('/api/rsvps/counts', (req, res) => {
  let confirmed = 0, declined = 0, maybe = 0;
  for (let entry of rsvpMap.values()) {
    if (entry.status === 'Yes') confirmed++;
    else if (entry.status === 'No') declined++;
    else maybe++;
  }

  res.json({
    total: rsvpMap.size,
    confirmed,
    declined,
    maybe
  });
});
