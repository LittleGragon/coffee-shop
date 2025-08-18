"use client";

import { useState } from "react";

export default function OrderedPage() {
  const [name] = useState<string>(() => {
    if (typeof window === "undefined") return "User";
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u?.name || "User";
    } catch {
      return "User";
    }
  });
  return (
    <main className="screen" aria-label="Order placed confirmation">
      {/* Top bar with back */}
      <header className="header">
        <a href="/cart" className="back" aria-label="Back">
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
        <span />
      </header>

      {/* Content */}
      <section className="content">
        <div className="hero">
          <img src="/figma/2_1623/4.svg" alt="" aria-hidden="true" className="heroBase" />
          <img src="/figma/2_1623/5.svg" alt="" aria-hidden="true" className="heroAccent a1" />
          <img src="/figma/2_1623/6.svg" alt="" aria-hidden="true" className="heroAccent a2" />
          <img src="/figma/2_1623/7.svg" alt="" aria-hidden="true" className="heroAccent a3" />
          <img src="/figma/2_1623/8.svg" alt="" aria-hidden="true" className="heroAccent a4" />
          <img src="/figma/2_1623/9.svg" alt="" aria-hidden="true" className="heroAccent a5" />
        </div>
        <h1 className="title">Ordered</h1>
        <p className="sub">{name}, your order has been successfully placed.</p>

        <p className="details">
          The order will be ready today
          <br />
          to 18:10 at the address
          <br />
          Bradford BD1 1PR.
        </p>

        <p className="hint">
          Submit your personal QR code
          <br />
          at a coffee shop to receive an order.
        </p>
      </section>

      <style jsx>{`
        .screen {
          min-height: 100svh;
          background: #ffffff;
          padding: clamp(10px, 4vw, 16px);
          display: grid;
          grid-template-rows: auto 1fr;
        }
        .header {
          display: grid;
          grid-template-columns: 24px 1fr;
          align-items: center;
        }
        .back {
          display: inline-grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }
        .content {
          display: grid;
          justify-items: center;
          text-align: center;
          padding: 12px 16px 24px;
          gap: 14px;
        }
        .hero {
          width: clamp(160px, 55vw, 260px);
          margin-top: clamp(12px, 8vh, 40px);
          position: relative;
        }
        .heroBase {
          width: 100%;
          height: auto;
          display: block;
        }
        .heroAccent {
          position: absolute;
          width: 22%;
          height: auto;
        }
        .heroAccent.a1 { top: 52%; left: 56%; transform: translate(-50%, -50%); }
        .heroAccent.a2 { top: 56%; left: 34%; width: 6%; }
        .heroAccent.a3 { top: 56%; left: 42%; width: 6%; }
        .heroAccent.a4 { bottom: 6%; right: 22%; width: 9%; }
        .heroAccent.a5 { bottom: 6%; right: 6%; width: 9%; }
        .title {
          margin: 6px 0 2px;
          color: #181D2D;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: 0.2px;
        }
        .sub {
          margin: 0;
          color: #AAAAAA;
          font-size: 14px;
          line-height: 1.5;
        }
        .details {
          margin: 18px 0 0;
          color: #000000;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 400;
        }
        .hint {
          margin: 10px 0 0;
          color: #AAAAAA;
          font-size: 14px;
          line-height: 1.5;
        }

        @media (min-width: 768px) {
          .screen {
            grid-template-columns: 1fr minmax(360px, 480px) 1fr;
          }
          .header,
          .content {
            grid-column: 2;
          }
        }
      `}</style>
    </main>
  );
}