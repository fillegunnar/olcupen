import { useState, useEffect } from "react";
import "./Tournament.css";

const SHEET_ID = "1y0CI3Nh6uqtyZBh0aC2C6aAggKkq0Nw_";

/** Fetch a range from a published Google Sheet via the gviz JSON endpoint. */
async function fetchSheetRange(range: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&range=${encodeURIComponent(range)}`;
  const res = await fetch(url);
  const text = await res.text();

  // Response is JSONP: google.visualization.Query.setResponse({...});
  // Strip the wrapper to get pure JSON.
  const jsonStr = text.replace(/^[^(]*\(/, "").replace(/\);?\s*$/, "");
  const data = JSON.parse(jsonStr);

  return (
    data.table.rows as { c: ({ v: string | number | null } | null)[] }[]
  ).map((row) => row.c.map((cell) => (cell?.v != null ? String(cell.v) : "")));
}

export default function Tournament() {
  const [cellValue, setCellValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSheetRange("A4")
      .then((rows) => {
        setCellValue(rows[0]?.[0] ?? "(tom)");
      })
      .catch((err) => {
        console.error("Failed to fetch sheet data:", err);
        setError("Kunde inte hämta data från Google Sheets.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page tournament">
      <header className="tournament-header">
        <h1>Tabeller & Spelscheman</h1>
      </header>

      <section className="tournament-section">
        <h2>Värde från Google Sheets (A4)</h2>

        {loading && <p className="tournament-loading">Hämtar data…</p>}
        {error && <p className="tournament-error">{error}</p>}
        {cellValue !== null && (
          <div className="tournament-cell-value">{cellValue}</div>
        )}
      </section>
    </div>
  );
}
