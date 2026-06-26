import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, name, email, partySize, invitedBy, submittedAt } = req.body;

    if (!id || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        party_size INTEGER DEFAULT 1,
        invited_by TEXT,
        submitted_at TIMESTAMP NOT NULL
      )
    `;

    // Insert RSVP
    await sql`
      INSERT INTO rsvps (id, name, email, party_size, invited_by, submitted_at)
      VALUES (${id}, ${name}, ${email}, ${partySize || 1}, ${invitedBy}, ${submittedAt})
      ON CONFLICT (id) DO UPDATE SET
        name = ${name},
        email = ${email},
        party_size = ${partySize || 1},
        invited_by = ${invitedBy},
        submitted_at = ${submittedAt}
    `;

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Failed to save RSVP', details: error.message });
  }
}
