"use client";

import { useState } from "react";

export default function RateModalPreview() {
  const [rating, setRating] = useState(4); // preselect 4/5

  return (
    <main className="screen" aria-label="Select your coffee with rating modal">
      {/* Background section (simplified menu preview) */}
      <header className="topbar">
        <div className="welcome">
          <span className="muted">Welcome!</span>
          <a href="/profile" className="name">Alex</a>
        </div>
        <div className="topIcons">
          <a href="/cart" aria-label="Cart">
            <img src="/figma/2_1093/18.svg" alt="" aria-hidden="true" />
          </a>
          <a href="/profile" aria-label="Profile">
            <img src="/figma/2_1093/19.svg" alt="" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="menu">
        <h2 className="menuTitle">Select your coffee</h2>
        <div className="cards">
          <article className="card">
            <img className="cup" src="/figma/2_1093/9.png" alt="Coffee" />
            <div className="label">Raf</div>
          </article>
          <article className="card">
            <img className="cup" src="/figma/2_1093/10.png" alt="Coffee" />
            <div className="label">Espresso</div>
          </article>
          <article className="card">
            <img className="cup" src="/figma/2_1093/11.png" alt="Coffee" />
            <div className="label">Latte</div>
          </article>
          <article className="card">
            <img className="cup" src="/figma/2_1093/12.png" alt="Coffee" />
            <div className="label">Flat White</div>
          </article>
        </div>
      </section>

      {/* Overlay Modal */}
      <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="rateTitle" aria-describedby="rateSub">
        <div className="scrim" onClick={() => (window.location.href = "/menu")} aria-hidden="true" />
        <section className="cardModal">
          <header className="modalHead">
            <h3 id="rateTitle" className="modalTitle">The order has been completed.</h3>
            <p id="rateSub" className="modalSub">Please, rate the service.</p>
          </header>

          <div className="divider" />

          <div className="stars" role="radiogroup" aria-label="Rate service">
            {[0, 1, 2, 3, 4].map((i) => {
              const filled = i < rating;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={filled && rating === i + 1}
                  className={"starBtn" + (filled ? " filled" : "")}
                  onClick={() => setRating(i + 1)}
                  title={`${i + 1} star${i ? "s" : ""}`}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="starIcon"
                  >
                    <path
                      d="M12 2.5l2.9 5.88 6.5.94-4.7 4.58 1.1 6.46L12 17.78 6.2 20.36l1.1-6.46-4.7-4.58 6.5-.94L12 2.5z"
                      fill={filled ? "#FF9F2E" : "none"}
                      stroke={filled ? "#FF9F2E" : "#C9D1D8"}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          <div className="divider" />

          <button
            type="button"
            className="action"
            onClick={() => (window.location.href = "/menu")}
          >
            Remind me later
          </button>

          <div className="divider" />

          <button
            type="button"
            className="action strong"
            onClick={() => (window.location.href = "/menu")}
          >
            No, thanks
          </button>
        </section>
      </div>

      <style jsx>{`
        .screen {
          min-height: 100svh;
          background: #f0f3f6;
          padding: clamp(10px, 4vw, 16px);
          position: relative;
        }
        .topbar {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          margin-bottom: 8px;
        }
        .welcome {
          display: grid;
          gap: 2px;
        }
        .muted {
          color: #97a3af;
          font-size: 12px;
          font-weight: 600;
        }
        .name {
          color: #324a59;
          font-weight: 700;
          text-decoration: none;
        }
        .topIcons {
          display: grid;
          grid-auto-flow: column;
          gap: 12px;
          align-items: center;
        }
        .topIcons img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        .menu {
          background: #243846;
          color: #fff;
          border-radius: 18px;
          padding: 14px;
        }
        .menuTitle {
          margin: 0 0 10px;
          font-size: 14px;
          font-weight: 600;
          opacity: 0.9;
        }
        .cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .card {
          background: #e8edf2;
          border-radius: 14px;
          padding: 10px;
          display: grid;
          justify-items: center;
        }
        .cup {
          width: 90%;
          height: auto;
          object-fit: contain;
          margin-top: 4px;
        }
        .label {
          color: #243846;
          font-size: 12px;
          font-weight: 600;
          margin-top: 6px;
          margin-bottom: 2px;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
        }
        .scrim {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
        }
        .cardModal {
          position: absolute;
          left: 50%;
          top: 40%;
          transform: translate(-50%, -40%);
          width: min(320px, 92vw);
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
          padding: 14px 0;
          text-align: center;
        }
        .modalHead {
          padding: 0 18px 6px;
        }
        .modalTitle {
          margin: 0 0 4px;
          color: #1b2431;
          font-weight: 800;
          font-size: 18px;
        }
        .modalSub {
          margin: 0 0 8px;
          color: #6b7a8a;
          font-size: 13px;
        }
        .divider {
          height: 1px;
          background: #e9edf2;
        }
        .stars {
          display: grid;
          grid-auto-flow: column;
          justify-content: center;
          gap: 18px;
          padding: 12px 0;
        }
        .starBtn {
          border: none;
          background: transparent;
          padding: 4px;
          cursor: pointer;
        }
        .starBtn:focus-visible {
          outline: 2px solid #324a59;
          border-radius: 6px;
        }
        .action {
          width: 100%;
          background: transparent;
          border: none;
          padding: 14px 8px;
          color: #3b4a59;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        .action.strong {
          color: #1b2431;
        }

        @media (min-width: 768px) {
          .screen {
            display: grid;
            grid-template-columns: 1fr minmax(360px, 480px) 1fr;
            grid-auto-rows: min-content;
          }
          .topbar,
          .menu {
            grid-column: 2;
          }
        }
      `}</style>
    </main>
  );
}