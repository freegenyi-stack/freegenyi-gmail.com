/**
 * Fusionne les conversations directes dupliquées et remplit direct_key.
 * Usage: npm run db:fix:direct-chats
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const { Pool } = require("pg");

function directKey(a, b) {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return `d:${lo}:${hi}`;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: directs } = await client.query(`
      SELECT c.id, c.direct_key, c.last_message_at,
        array_agg(cm.user_id ORDER BY cm.user_id) AS members
      FROM conversations c
      JOIN conversation_members cm ON cm.conversation_id = c.id
      WHERE c.type = 'direct' OR c.type IS NULL
      GROUP BY c.id
      HAVING count(cm.user_id) = 2
    `);

    const pairMap = new Map();
    for (const row of directs) {
      const [a, b] = row.members;
      const key = directKey(a, b);
      if (!pairMap.has(key)) pairMap.set(key, []);
      pairMap.get(key).push(row);
    }

    let merged = 0;
    for (const [key, convs] of pairMap) {
      convs.sort((x, y) => {
        const tx = x.last_message_at ? new Date(x.last_message_at).getTime() : 0;
        const ty = y.last_message_at ? new Date(y.last_message_at).getTime() : 0;
        return ty - tx || y.id - x.id;
      });
      const canonical = convs[0];
      await client.query(`UPDATE conversations SET direct_key = $1, type = 'direct' WHERE id = $2`, [
        key,
        canonical.id,
      ]);

      for (let i = 1; i < convs.length; i++) {
        const dup = convs[i];
        await client.query(`UPDATE chat_messages SET conversation_id = $1 WHERE conversation_id = $2`, [
          canonical.id,
          dup.id,
        ]);
        await client.query(`DELETE FROM conversations WHERE id = $1`, [dup.id]);
        merged++;
      }
    }

    await client.query("COMMIT");
    console.log(`OK — ${merged} conversation(s) directe(s) fusionnée(s), ${pairMap.size} paire(s) normalisée(s).`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
