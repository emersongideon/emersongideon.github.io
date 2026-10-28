"""Pull an FPL team's season-by-season and gameweek history from the public
Fantasy Premier League API and write it to src/data/fpl.json.

Runs anywhere Python 3 does, including Google Colab (standard library only):

    ENTRY_ID = 123456     # edit this
    then run the cell.

From a terminal:

    FPL_ENTRY_ID=123456 python scripts/fetch-fpl.py
"""

import json
import os
import urllib.request
from pathlib import Path

# Your team id: the number in fantasy.premierleague.com/entry/<ENTRY_ID>/event/...
# In Colab, set it here; from the shell, export FPL_ENTRY_ID instead.
ENTRY_ID = int(os.environ.get("FPL_ENTRY_ID", "0"))

# Where to write. In Colab, point this at a path you can download.
OUT = Path(os.environ.get("FPL_OUT", Path(__file__).resolve().parent.parent / "src" / "data" / "fpl.json"))

API = "https://fantasy.premierleague.com/api"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def main():
    if not ENTRY_ID:
        raise SystemExit("Set ENTRY_ID (in the script) or FPL_ENTRY_ID (env var) to your team id.")

    entry = get(f"{API}/entry/{ENTRY_ID}/")
    history = get(f"{API}/entry/{ENTRY_ID}/history/")

    gameweeks = [
        {
            "gw": gw["event"],
            "points": gw["points"],
            "total_points": gw["total_points"],
            "overall_rank": gw["overall_rank"],
            "gw_rank": gw["rank"],
        }
        for gw in history["current"]
    ]
    seasons = [
        {"season": s["season_name"], "total_points": s["total_points"], "rank": s["rank"]}
        for s in history["past"]
    ]

    data = {
        "team_name": entry.get("name"),
        "manager": f"{entry.get('player_first_name', '')} {entry.get('player_last_name', '')}".strip(),
        "best_overall_rank": min((gw["overall_rank"] for gw in gameweeks), default=None),
        "gameweeks": gameweeks,
        "past_seasons": seasons,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2))
    print(f"Wrote {len(gameweeks)} gameweeks for '{data['team_name']}' to {OUT}")


if __name__ == "__main__":
    main()
