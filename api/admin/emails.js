import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Get all RSVPs
    const result = await sql`
      SELECT name, email, party_size, invited_by, submitted_at
      FROM rsvps
      ORDER BY submitted_at DESC
    `;

    const emails = result.rows.map(row => ({
      email: row.email,
      name: row.name,
      partySize: row.party_size,
      invitedBy: row.invited_by,
      submittedAt: row.submitted_at
    }));

    res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
  }
}
