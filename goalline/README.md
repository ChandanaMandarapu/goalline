# GoalLine

**World Cup Fan Experience — powered by TxLINE on Solana**

Live World Cup match scores, cryptographically-verified odds, and a pick-em prediction game. Every odds update is signed and anchored on Solana via TxLINE, so the data you're betting your bragging rights on is provably unmanipulated.

**Track:** Consumer and Fan Experiences  
**Data source:** TxLINE (World Cup Free Tier — Service Level 12, real-time)  
**Built for:** TxODDS World Cup Hackathon · Superteam India Buildathon

---

## What it does

- **Live scores** — real-time score updates for ongoing World Cup matches
- **Verified odds** — 1x2 odds from TxLINE, each showing the Solana on-chain verification signature and timestamp
- **Pick 'em** — tap an outcome to lock in your prediction before kickoff; your picks persist in local state
- **Upcoming fixtures** — today's remaining matches with pre-match odds

The "Verified on-chain" badge under every match shows the TxLINE program address and how recently the data was anchored — making the Solana data provenance visible to fans, not just developers.

---

## Why TxLINE makes this different

Every sports data app shows odds. GoalLine shows *where those odds came from* — a Solana transaction you can look up on the explorer. That's not a gimmick: it means the odds you see haven't been post-processed, delayed, or selectively chosen by an intermediary. TxLINE's cryptographic signing is the entire trust model.

---

## Running locally

```bash
npm install
npm start
```

## Deploying to Vercel

```bash
npm run build
# then connect your GitHub repo to Vercel — it auto-detects Create React App
```

## Connecting real TxLINE data

The app currently runs on realistic mock data for the demo. To wire in live data:

1. Subscribe to TxLINE World Cup Free Tier (Service Level 12, no payment required) following the [quickstart guide](https://txline.txodds.com/documentation/quickstart)
2. Copy your activated API token and guest JWT
3. Replace the `MOCK_MATCHES` array in `src/App.jsx` with a `useEffect` that calls:
   ```
   GET https://txline.txodds.com/api/fixtures?leagueId=500001
   GET https://txline.txodds.com/api/odds/snapshot?fixtureId={id}
   ```
   with headers `Authorization: Bearer {jwt}` and `X-Api-Token: {apiToken}`

---

Built by Chandana "Maha" Mandarapu · [@chandana_mndrpu](https://x.com/chandana_mndrpu)
