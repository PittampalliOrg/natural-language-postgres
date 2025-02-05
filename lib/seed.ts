// lib/seed.ts

import "dotenv/config";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { unicorns } from "./db/migrations/schema";

function parseDate(dateString: string): string {
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const month = parts[0].padStart(2, "0");
    const day = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  console.warn(`Could not parse date: ${dateString}`);
  throw Error(`Invalid date format: ${dateString}`);
}

export async function seed() {
  // 1. Connect with drizzle via pg Pool
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
  const db = drizzle(pool);

  // 2. (Optional) Create the table if you haven't run a Drizzle migration
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS unicorns (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL UNIQUE,
      valuation DECIMAL(10, 2) NOT NULL,
      date_joined DATE,
      country VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      industry VARCHAR(255) NOT NULL,
      select_investors TEXT NOT NULL
    );
  `);
  console.log(`Created "unicorns" table if not exists`);

  // 3. Parse CSV
  const results: any[] = [];
  const csvFilePath = path.join(process.cwd(), "unicorns.csv");

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(),
      }))
      .on("data", (data) => results.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  // 4. Insert rows
  for (const row of results) {
    const formattedDate = parseDate(row["Date Joined"]);
    const valuationRaw = row["Valuation ($B)"].replace("$", "").replace(",", "");
    const valuationStr = valuationRaw;

    await db.insert(unicorns).values({
      company: row.Company,
      valuation: valuationStr, // pass a string if you used .$type<string>()
      dateJoined: formattedDate,
      country: row.Country,
      city: row.City,
      industry: row.Industry,
      selectInvestors: row["Select Investors"],
    })
      .onConflictDoNothing({
        target: unicorns.company,
      });
  }

  console.log(`Seeded ${results.length} unicorns`);

  // Close pool to finish
  await pool.end();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
