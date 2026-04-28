import { useState, useEffect } from "react";
import "./Teams.css";

const SHEET_ID = "1tTBYMpITnovYxM-_KXXcfbsI4ZFt8Wwdj6p9nslah6c";

interface TeamData {
  name: string;
  logo: string;
  players: string[];
  activePlayers: string[];
}

type GvizCell = { v: string | null; f?: string } | null;
type GvizRow = { c: GvizCell[] };

async function fetchTeams(): Promise<TeamData[]> {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:json&headers=0`;
  const res = await fetch(url);
  const text = await res.text();
  const jsonStr = text.replace(/^[^(]*\(/, "").replace(/\);?\s*$/, "");
  const data = JSON.parse(jsonStr);

  return (data.table.rows as GvizRow[])
    .filter((row) => row.c[0]?.v)
    .map((row) => {
      const name = String(row.c[0]!.v!).trim();
      const logo = row.c[2]?.v ? String(row.c[2].v).trim() : "";
      const rawPlayers = row.c[1]?.v ? String(row.c[1].v) : "";
      const allPlayers = rawPlayers
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);
      const activePlayers = allPlayers
        .filter((p) => /\(A\)/i.test(p))
        .map((p) => p.replace(/\s*\(A\)\s*/gi, "").trim());
      const players = allPlayers
        .filter((p) => !/\(A\)/i.test(p))
        .map((p) => p.trim());
      return { name, logo, players, activePlayers };
    });
}

export default function Teams() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ok">("loading");

  useEffect(() => {
    fetchTeams()
      .then((data) => {
        setTeams(data);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="teams-page">
      <div className="teams-header">
        <h1>Lag &amp; Spelare</h1>
      </div>

      {status === "loading" && <p className="teams-loading">Laddar lag…</p>}
      {status === "error" && (
        <p className="teams-error">Kunde inte hämta lagdata.</p>
      )}
      {status === "ok" && (
        <div className="teams-grid">
          {teams.map((team) => (
            <div key={team.name} className="team-card">
              {team.logo && (
                <img
                  className="team-card-bg"
                  src={team.logo}
                  alt=""
                  aria-hidden="true"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <h2 className="team-card-name">{team.name}</h2>
              <span className="team-active-label">Ölspelare</span>
              <ul className="team-player-list">
                {team.players.map((player, i) => (
                  <li key={i}>{player}</li>
                ))}
              </ul>
              <div className="team-active-players">
                {team.activePlayers.length > 0 ? (
                  <>
                    <span className="team-active-label">
                      Aktiva fotbollsspelare
                    </span>
                    <ul className="team-player-list">
                      {team.activePlayers.map((player, i) => (
                        <li key={i}>{player}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <span className="team-active-label team-active-none">
                    {team.name} har bara ölspelare, inga aktiva fotbollsspelare.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
