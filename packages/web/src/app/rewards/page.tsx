"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api-client";

type RewardsGet = {
  success: boolean;
  balance: number;
  history: { id: string; type: string; points: number; reason?: string | null; created_at: string }[];
  redeemables: { id: string; name: string; points: number }[];
};

export default function RewardsPage() {
  const [filled, setFilled] = useState<number>(4);
  const [total] = useState<number>(8);
  const [points, setPoints] = useState<number>(2750);
  const [history, setHistory] = useState<{ name: string; date: string; pts: number }[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiGet<RewardsGet>("/api/rewards");
        if (!mounted || !res?.success) return;
        // Points
        setPoints(res.balance ?? 0);
        // Loyalty stamps are not yet modeled; naive mapping: 1 stamp per 500 pts
        const computedFilled = Math.max(0, Math.min(8, Math.floor((res.balance ?? 0) / 500)));
        setFilled(computedFilled);

        // Map history
        const mapped = (res.history || []).map((h) => ({
          name: h.reason ? h.reason : h.type === "earn" ? "Earned points" : "Redeemed",
          date: new Date(h.created_at).toLocaleString(),
          pts: h.points > 0 ? h.points : Math.abs(h.points),
        }));
        setHistory(mapped);
      } catch {
        // leave defaults for unauthenticated users
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="screen" aria-label="Rewards">
      {/* Header */}
      <header className="header">
        <a href="/menu" className="back" aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="#001833"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <h1 className="title">Rewards</h1>
        <span />
      </header>

      {/* Loyalty Card */}
      <section className="card dark" aria-label="Loyalty progress">
        <div className="cardHead">
          <div className="cardTitle">Loyalty card</div>
          <div className="cardMeta">
            <strong>{filled}</strong> / {total}
          </div>
        </div>
        <div className="stampStrip" role="group" aria-label="Stamp progress">
          {[...Array(total)].map((_, i) => (
            <span
              key={i}
              className={"stamp" + (i < filled ? " filled" : "")}
              aria-label={i < filled ? "Filled" : "Empty"}
            >
              <img
                src={i < filled ? "/figma/2_1408/9.svg" : "/figma/2_1408/10.svg"}
                alt=""
                aria-hidden="true"
                className="stampImg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </span>
          ))}
        </div>
      </section>

      {/* Points Card */}
      <section className="card dark" aria-label="My Points">
        <div className="pointsRow">
          <div className="pointsBlock">
            <div className="caption">My Points:</div>
            <div className="points">{points}</div>
          </div>
          <a
            className="redeemBtn"
            href="/rewards/redeem"
            aria-label="Redeem drinks"
          >
            Redeem drinks
          </a>
        </div>
        <div className="decor">
          <img
            src="/figma/2_1408/16.svg"
            alt=""
            aria-hidden="true"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
          />
        </div>
      </section>

      {/* History */}
      <section className="history">
        <h2 className="historyTitle">History Rewards</h2>
        <ul className="historyList" role="list">
          {history.map((h, idx) => (
            <li key={idx} className="hRow">
              <div className="hMeta">
                <div className="hName">{h.name}</div>
                <div className="hDate">{h.date}</div>
              </div>
              <div className="hPts">+ {h.pts} Pts</div>
            </li>
          ))}
          {history.length === 0 && (
            <li className="hRow">
              <div className="hMeta">
                <div className="hName">No history yet</div>
                <div className="hDate">Make your first purchase</div>
              </div>
              <div className="hPts">+ 0 Pts</div>
            </li>
          )}
        </ul>
      </section>

      {/* Bottom Nav */}
      <nav className="bottomNav" aria-label="Primary">
        <a className="navBtn" href="/stores/select" aria-label="Stores">
          <img src="/figma/2_1408/13.svg" alt="" aria-hidden="true" />
        </a>
        <a className="navBtn active" href="/rewards" aria-current="page" aria-label="Rewards">
          <img src="/figma/2_1408/14.svg" alt="" aria-hidden="true" />
        </a>
        <a className="navBtn" href="/profile" aria-label="Profile">
          <img src="/figma/2_1408/15.svg" alt="" aria-hidden="true" />
        </a>
      </nav>

      <style jsx>{`
        .screen {
          min-height: 100svh;
          background: #ffffff;
          padding: clamp(10px, 4vw, 16px);
          padding-bottom: 98px;
          display: grid;
          grid-template-rows: auto auto auto 1fr;
          gap: 16px;
        }
        .header {
          display: grid;
          grid-template-columns: 24px 1fr 24px;
          align-items: center;
        }
        .title {
          margin: 0;
          text-align: center;
          color: #001833;
          font-weight: 600;
          font-size: 18px;
        }

        .card.dark {
          position: relative;
          background: #324a59;
          border-radius: 16px;
          padding: 16px;
          color: #eaf2f7;
          overflow: hidden;
        }
        .cardHead {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          margin-bottom: 12px;
        }
        .cardTitle {
          color: #eaf2f7;
          font-weight: 600;
          font-size: 14px;
          opacity: 0.95;
        }
        .cardMeta {
          color: #eaf2f7;
          font-weight: 600;
          font-size: 13px;
          opacity: 0.9;
        }

        .stampStrip {
          background: #ffffff;
          border-radius: 12px;
          padding: 10px 12px;
          display: grid;
          grid-auto-flow: column;
          gap: 10px;
          justify-content: space-between;
          align-items: center;
        }
        .stamp {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          opacity: 0.45;
        }
        .stamp.filled {
          opacity: 1;
        }
        .stampImg {
          width: 22px;
          height: 22px;
          object-fit: contain;
          display: block;
        }

        .pointsRow {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 12px;
        }
        .pointsBlock .caption {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .pointsBlock .points {
          color: #ffffff;
          font-weight: 700;
          font-size: 32px;
          letter-spacing: 0.5px;
        }
        .redeemBtn {
          height: 32px;
          padding: 0 12px;
          border: none;
          border-radius: 8px;
          background: #5b6c77;
          color: #ffffff;
          font-weight: 600;
          font-size: 12px;
          display: inline-grid;
          place-items: center;
        }
        .decor {
          position: absolute;
          right: -6px;
          bottom: -6px;
          opacity: 0.2;
        }
        .decor img {
          width: 120px;
          height: auto;
        }

        .history {
          display: grid;
          gap: 8px;
        }
        .historyTitle {
          margin: 0;
          color: #324a59;
          font-weight: 600;
          font-size: 14px;
          opacity: 0.9;
        }
        .historyList {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }
        .hRow {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .hMeta {
          display: grid;
          gap: 3px;
        }
        .hName {
          color: #001833;
          font-weight: 600;
          font-size: 14px;
        }
        .hDate {
          color: #9aa6b2;
          font-size: 12px;
        }
        .hPts {
          color: #001833;
          font-weight: 700;
          font-size: 14px;
        }

        .bottomNav {
          position: fixed;
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%);
          width: min(340px, 92vw);
          height: 64px;
          background: #ffffff;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          align-items: center;
          padding: 0 22px;
          z-index: 20;
        }
        .navBtn {
          display: grid;
          place-items: center;
          height: 40px;
          border-radius: 12px;
        }
        .navBtn img {
          width: 22px;
          height: 22px;
          object-fit: contain;
          opacity: 0.6;
        }
        .navBtn.active img {
          opacity: 1;
        }

        @media (min-width: 768px) {
          .screen {
            grid-template-columns: 1fr minmax(360px, 480px) 1fr;
          }
          .header,
          .card,
          .history {
            grid-column: 2;
          }
          .bottomNav {
            width: min(430px, 92vw);
          }
        }
      `}</style>
    </main>
  );
}