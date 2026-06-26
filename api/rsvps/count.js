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

    // Get counts
    const result = await sql`
      SELECT
        COUNT(*) as total_rsvps,
        COALESCE(SUM(party_size), 0) as total_guests
      FROM rsvps
    `;

    const totalRSVPs = parseInt(result.rows[0].total_rsvps) || 0;
    const totalGuests = parseInt(result.rows[0].total_guests) || 0;

    res.status(200).json({
      totalRSVPs,
      totalGuests
    });
  } catch (error) {
    console.error('Error counting RSVPs:', error);
    res.status(500).json({ error: 'Failed to count RSVPs', details: error.message });
  }
}
