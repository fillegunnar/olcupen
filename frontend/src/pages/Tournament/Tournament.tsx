import { useState, useEffect, useCallback } from "react";
import "./Tournament.css";

const SHEET_ID = "1y0CI3Nh6uqtyZBh0aC2C6aAggKkq0Nw_";

interface StandingsRow {
  team: string;
  gp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

interface MatchRow {
  time: string;
  home: string;
  away: string;
  homeGoals: string;
  awayGoals: string;
}

interface GroupData {
  name: string;
  standings: StandingsRow[];
  matches: MatchRow[];
}

type GvizCell = { v: string | number | null; f?: string } | null;
type GvizRow = { c: GvizCell[] };

/** Fetch a range from a named sheet via the gviz JSON endpoint (headers=0 for raw rows). */
async function fetchSheet(sheet: string, range: string): Promise<string[][]> {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:json&headers=0` +
    `&sheet=${encodeURIComponent(sheet)}` +
    `&range=${encodeURIComponent(range)}`;
  const res = await fetch(url);
  const text = await res.text();

  const jsonStr = text.replace(/^[^(]*\(/, "").replace(/\);?\s*$/, "");
  const data = JSON.parse(jsonStr);

  return (data.table.rows as GvizRow[]).map((row) =>
    row.c.map((cell) => {
      if (cell == null) return "";
      // Times come as "Date(...)" — use the formatted value instead.
      if (cell.f != null) return cell.f;
      return cell.v != null ? String(cell.v) : "";
    }),
  );
}

/** Parse raw rows into standings + schedule for one group. */
function parseGroup(name: string, rows: string[][]): GroupData {
  // Row 0 = header row ("Tabell", "GP", "W", …) — skip it.
  // Rows 1–4 = standings (C=team, D=GP, E=W, F=D, G=L, H=GF, I=GA, J=GD, K=PTS).
  // Rows 5+ = matches  (A=time, B=home, C=away, D=homeGoals, E=":", F=awayGoals).
  const standings: StandingsRow[] = [];
  const matches: MatchRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    // Standings rows: no time (col A empty), team name in col C, header row has "Tabell"
    if (!r[0] && r[2] && r[2] !== "Tabell") {
      standings.push({
        team: r[2],
        gp: Number(r[3]) || 0,
        w: Number(r[4]) || 0,
        d: Number(r[5]) || 0,
        l: Number(r[6]) || 0,
        gf: Number(r[7]) || 0,
        ga: Number(r[8]) || 0,
        gd: Number(r[9]) || 0,
        pts: Number(r[10]) || 0,
      });
    }
    // Match rows: have a time in col A
    if (r[0]) {
      matches.push({
        time: r[0],
        home: r[1],
        away: r[2],
        homeGoals: r[3],
        awayGoals: r[5],
      });
    }
  }

  return { name, standings, matches };
}

function GroupSection({ group }: { group: GroupData }) {
  return (
    <section className="tournament-group">
      <h2>{group.name}</h2>

      <div className="tournament-table-wrap">
        <table className="tournament-standings">
          <thead>
            <tr>
              <th>Lag</th>
              <th>GP</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {group.standings.map((s) => (
              <tr key={s.team}>
                <td className="team-name">{s.team}</td>
                <td>{s.gp}</td>
                <td>{s.w}</td>
                <td>{s.d}</td>
                <td>{s.l}</td>
                <td>{s.gf}</td>
                <td>{s.ga}</td>
                <td>{s.gd}</td>
                <td className="pts">{s.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Spelschema</h3>
      <div className="tournament-table-wrap">
        <table className="tournament-schedule">
          <thead>
            <tr>
              <th>Tid</th>
              <th>Hemma</th>
              <th className="score-col">Resultat</th>
              <th>Borta</th>
            </tr>
          </thead>
          <tbody>
            {group.matches.map((m, i) => (
              <tr key={i}>
                <td className="match-time">{m.time}</td>
                <td className="team-home">{m.home}</td>
                <td className="match-score">
                  {m.homeGoals || m.awayGoals
                    ? `${m.homeGoals} – ${m.awayGoals}`
                    : "–"}
                </td>
                <td className="team-away">{m.away}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const POLL_INTERVAL_MS = 30_000;

export default function Tournament() {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    try {
      const [rowsO, rowsL] = await Promise.all([
        fetchSheet("Ö", "A1:K20"),
        fetchSheet("L", "A1:K20"),
      ]);
      setGroups([parseGroup("Grupp Ö", rowsO), parseGroup("Grupp L", rowsL)]);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch sheet data:", err);
      setError("Kunde inte hämta data från Google Sheets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
    const id = setInterval(fetchGroups, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") fetchGroups();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchGroups]);

  return (
    <div className="page tournament">
      <header className="tournament-header">
        <h1>Tabeller & Spelscheman</h1>
      </header>

      {loading && <p className="tournament-loading">Hämtar data…</p>}
      {error && <p className="tournament-error">{error}</p>}
      {groups.map((g) => (
        <GroupSection key={g.name} group={g} />
      ))}
    </div>
  );
}
