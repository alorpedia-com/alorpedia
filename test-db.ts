import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  console.log("Testing connection to:", connectionString?.split("@")[1]);

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
  });

  try {
    const start = Date.now();
    const client = await pool.connect();
    console.log("Connected successfully in", Date.now() - start, "ms");

    const res = await client.query("SELECT NOW()");
    console.log("Query successful:", res.rows[0]);

    client.release();
  } catch (err: any) {
    console.error("Connection failed:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
