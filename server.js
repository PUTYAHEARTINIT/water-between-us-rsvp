import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'rsvps.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ rsvps: {} }, null, 2));
  }
}

// Read RSVPs from file
async function readRSVPs() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { rsvps: {} };
  }
}

// Write RSVPs to file
async function writeRSVPs(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// API: Save RSVP
app.post('/api/rsvp', async (req, res) => {
  try {
    const { id, name, email, partySize, invitedBy, submittedAt } = req.body;

    if (!id || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = await readRSVPs();
    data.rsvps[id] = { name, email, partySize, invitedBy, submittedAt };
    await writeRSVPs(data);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Failed to save RSVP' });
  }
});

// API: Get all RSVPs (for count)
app.get('/api/rsvps', async (req, res) => {
  try {
    const data = await readRSVPs();
    res.json(data.rsvps);
  } catch (error) {
    console.error('Error reading RSVPs:', error);
    res.status(500).json({ error: 'Failed to read RSVPs' });
  }
});

// API: Get RSVP count
app.get('/api/rsvps/count', async (req, res) => {
  try {
    const data = await readRSVPs();
    const rsvps = Object.values(data.rsvps);
    const totalGuests = rsvps.reduce((sum, rsvp) => sum + (Number(rsvp.partySize) || 1), 0);

    res.json({
      totalRSVPs: rsvps.length,
      totalGuests: totalGuests
    });
  } catch (error) {
    console.error('Error counting RSVPs:', error);
    res.status(500).json({ error: 'Failed to count RSVPs' });
  }
});

// Admin endpoint to export emails
app.get('/api/admin/emails', async (req, res) => {
  try {
    const data = await readRSVPs();
    const rsvps = Object.values(data.rsvps);
    const emails = rsvps.map(rsvp => ({
      email: rsvp.email,
      name: rsvp.name,
      partySize: rsvp.partySize,
      invitedBy: rsvp.invitedBy,
      submittedAt: rsvp.submittedAt
    }));

    res.json(emails);
  } catch (error) {
    console.error('Error exporting emails:', error);
    res.status(500).json({ error: 'Failed to export emails' });
  }
});

// Start server
await initDataFile();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin.html`);
});
