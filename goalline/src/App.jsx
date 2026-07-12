import { useState, useEffect, useCallback } from "react";
import "./App.css";

const TXLINE_API = "https://txline.txodds.com/api";

const MOCK_MATCHES = [
  {
    id: "live-1",
    status: "live",
    minute: 74,
    home: { name: "Brazil", flag: "🇧🇷", score: 1 },
    away: { name: "France", flag: "🇫🇷", score: 1 },
    odds: { home: 2.10, draw: 3.40, away: 3.15 },
    txSig: "9ExbZj...KaA",
    verifiedAgo: "12s",
  },
  {
    id: "live-2",
    status: "live",
    minute: 51,
    home: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 0 },
    away: { name: "Portugal", flag: "🇵🇹", score: 0 },
    odds: { home: 2.60, draw: 3.20, away: 2.80 },
    txSig: "9ExbZj...KaA",
    verifiedAgo: "8s",
  },
  {
    id: "fix-1",
    status: "upcoming",
    kickoff: "18:00 IST",
    home: { name: "Germany", flag: "🇩🇪" },
    away: { name: "Spain", flag: "🇪🇸" },
    odds: { home: 2.45, draw: 3.10, away: 2.90 },
    txSig: "9ExbZj...KaA",
    verifiedAgo: "30s",
  },
  {
    id: "fix-2",
    status: "upcoming",
    kickoff: "21:30 IST",
    home: { name: "Argentina", flag: "🇦🇷" },
    away: { name: "Netherlands", flag: "🇳🇱" },
    odds: { home: 1.95, draw: 3.50, away: 3.80 },
    txSig: "9ExbZj...KaA",
    verifiedAgo: "28s",
  },
];

function VerifiedBadge({ txSig, verifiedAgo }) {
  return (
    <div className="verify-row">
      <div className="verify-dot" />
      <span className="verify-text">
        Verified on-chain · {txSig} · {verifiedAgo} ago
      </span>
    </div>
  );
}

function OddsButton({ label, value, picked, onClick }) {
  return (
    <button className={`odd-btn${picked ? " picked" : ""}`} onClick={onClick}>
      <span className="odd-label">{label}</span>
      <span className="odd-val">{value.toFixed(2)}</span>
    </button>
  );
}

function LiveCard({ match, picks, onPick }) {
  const myPick = picks[match.id];
  return (
    <div className="match-card live-card">
      <div className="match-header">
        <span className="live-pill">LIVE {match.minute}&apos;</span>
      </div>
      <div className="match-row">
        <div className="team">
          <span className="flag">{match.home.flag}</span>
          <span className="team-name">{match.home.name}</span>
        </div>
        <div className="score-center">
          <span className="score">
            {match.home.score} – {match.away.score}
          </span>
        </div>
        <div className="team team-right">
          <span className="team-name">{match.away.name}</span>
          <span className="flag">{match.away.flag}</span>
        </div>
      </div>
      <div className="odds-row">
        <OddsButton
          label={match.home.name}
          value={match.odds.home}
          picked={myPick === "home"}
          onClick={() => onPick(match.id, "home")}
        />
        <OddsButton
          label="Draw"
          value={match.odds.draw}
          picked={myPick === "draw"}
          onClick={() => onPick(match.id, "draw")}
        />
        <OddsButton
          label={match.away.name}
          value={match.odds.away}
          picked={myPick === "away"}
          onClick={() => onPick(match.id, "away")}
        />
      </div>
      <VerifiedBadge txSig={match.txSig} verifiedAgo={match.verifiedAgo} />
    </div>
  );
}

function FixtureCard({ match, picks, onPick }) {
  const myPick = picks[match.id];
  return (
    <div className="match-card fixture-card">
      <div className="fixture-row">
        <span className="fixture-teams">
          {match.home.flag} {match.home.name} vs {match.away.name} {match.away.flag}
        </span>
        <span className="fixture-time">{match.kickoff}</span>
      </div>
      <div className="odds-row odds-row-sm">
        <OddsButton
          label={match.home.name}
          value={match.odds.home}
          picked={myPick === "home"}
          onClick={() => onPick(match.id, "home")}
        />
        <OddsButton
          label="Draw"
          value={match.odds.draw}
          picked={myPick === "draw"}
          onClick={() => onPick(match.id, "draw")}
        />
        <OddsButton
          label={match.away.name}
          value={match.odds.away}
          picked={myPick === "away"}
          onClick={() => onPick(match.id, "away")}
        />
      </div>
      <VerifiedBadge txSig={match.txSig} verifiedAgo={match.verifiedAgo} />
    </div>
  );
}

function MyPicksTab({ picks, matches }) {
  const picked = Object.entries(picks).map(([id, side]) => {
    const match = matches.find((m) => m.id === id);
    if (!match) return null;
    const teamName =
      side === "home" ? match.home.name : side === "away" ? match.away.name : "Draw";
    return { id, match, teamName };
  }).filter(Boolean);

  if (picked.length === 0) {
    return (
      <div className="empty-picks">
        <p>No picks yet. Head to Live or Fixtures and tap an outcome to pick.</p>
      </div>
    );
  }

  return (
    <div className="picks-list">
      {picked.map(({ id, match, teamName }) => (
        <div key={id} className="pick-row">
          <span className="pick-match">
            {match.home.name} vs {match.away.name}
          </span>
          <span className="pick-choice">{teamName}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("live");
  const [picks, setPicks] = useState({});
  const [matches, setMatches] = useState(MOCK_MATCHES);
  const [apiStatus, setApiStatus] = useState("mock");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handlePick = useCallback((matchId, side) => {
    setPicks((prev) => ({ ...prev, [matchId]: side }));
  }, []);

  const liveMatches = matches.filter((m) => m.status === "live");
  const upcomingMatches = matches.filter((m) => m.status === "upcoming");
  const pickCount = Object.keys(picks).length;
  const streak = 4;

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          Goal<span className="logo-accent">Line</span>
        </div>
        <div className="header-right">
          <span className="txline-badge">
            ✓ Powered by TxLINE · Solana
          </span>
        </div>
      </header>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-num">{liveMatches.length}</div>
          <div className="stat-label">live now</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{upcomingMatches.length}</div>
          <div className="stat-label">upcoming today</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{pickCount > 0 ? `${streak}/${pickCount}` : "—"}</div>
          <div className="stat-label">your streak</div>
        </div>
      </div>

      <div className="tabs">
        {["live", "fixtures", "my picks"].map((t) => (
          <button
            key={t}
            className={`tab${tab === t ? " tab-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <main className="main-content">
        {tab === "live" && (
          <>
            {liveMatches.length === 0 ? (
              <p className="empty">No live matches right now. Check Fixtures for upcoming games.</p>
            ) : (
              liveMatches.map((m) => (
                <LiveCard key={m.id} match={m} picks={picks} onPick={handlePick} />
              ))
            )}
          </>
        )}

        {tab === "fixtures" && (
          <>
            <div className="section-eyebrow">Today's matches</div>
            {upcomingMatches.map((m) => (
              <FixtureCard key={m.id} match={m} picks={picks} onPick={handlePick} />
            ))}
          </>
        )}

        {tab === "my picks" && <MyPicksTab picks={picks} matches={matches} />}
      </main>

      <footer className="app-footer">
        <span className="footer-left">
          Odds verified on Solana · updated every 60s
        </span>
        <span className="footer-right">
          {apiStatus === "mock" ? "demo data" : "live · TxLINE"}
        </span>
      </footer>
    </div>
  );
}
