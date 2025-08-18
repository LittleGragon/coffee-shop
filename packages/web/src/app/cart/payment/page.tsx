"use client";

import { useState } from "react";

type Method = "online" | "card";

export default function PaymentPage() {
  const [method, setMethod] = useState<Method>("online");
  const total = 9.0; // matches prior screen subtotal
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
    <main className="screen" aria-label="Order payment">
      {/* Header (dimmed by overlay) */}
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
        <h1 className="title">My order</h1>
        <span />
      </header>

      {/* Overlay + Bottom Sheet */}
      <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="dialogTitle">
        <div className="scrim" onClick={() => (window.location.href = "/cart")} aria-hidden="true" />
        <section className="sheet" aria-label="Payment options">
          <h2 id="dialogTitle" className="sheetTitle">Order payment</h2>

          {/* Pickup/store row */}
          <div className="storeRow" role="group" aria-label="Pickup">
            <div className="storeIcon">
              <img
                src="/figma/2_1655/11.svg"
                alt=""
                aria-hidden="true"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="storeMeta">
              <div className="storeName">{name}</div>
              <div className="storeAddr">Magic Coffee store</div>
              <div className="storeAddr">Bradford BD1 1PR</div>
            </div>
          </div>

          {/* Methods */}
          <button
            type="button"
            className={"method" + (method === "online" ? " selected" : "")}
            aria-pressed={method === "online"}
            aria-label="Online payment, Assist Belarus"
            onClick={() => setMethod("online")}
          >
            <span className="radio" aria-hidden="true">
              <span className="dot" />
            </span>
            <span className="text">
              <span className="mTitle">Online payment</span>
              <span className="mSub">Assist Belarus</span>
            </span>
            <span className="brand">
              <img
                src="/figma/2_1655/18.png"
                alt="Assist"
                className="brandImg"
              />
            </span>
          </button>

          <button
            type="button"
            className={"method" + (method === "card" ? " selected" : "")}
            aria-pressed={method === "card"}
            aria-label="Credit Card ending 2648"
            onClick={() => setMethod("card")}
          >
            <span className="radio" aria-hidden="true">
              <span className="dot" />
            </span>
            <span className="text">
              <span className="mTitle">Credit Card</span>
              <span className="mSub">2540 xxxx xxxx 2648</span>
            </span>
            <span className="brand cluster">
              <img
                src="/figma/2_1655/6.png"
                alt="VISA"
                className="brandImg"
              />
              <img
                src="/figma/2_1655/7.png"
                alt="Mastercard"
                className="brandImg"
              />
            </span>
          </button>

          {/* Totals + CTA (inside sheet) */}
          <div className="summary" aria-live="polite">
            <div className="row">
              <div className="amountLabel">Amount</div>
              <div className="amountValue">BYN {total.toFixed(2)}</div>
            </div>

            <div className="ctaRow">
              <div className="totalBlock">
                <div className="totalLabel">Total Price</div>
                <div className="totalValue">BYN {total.toFixed(2)}</div>
              </div>
              <button
                className="payBtn"
                onClick={() => {
                  window.location.href = "/cart/ordered";
                }}
              >
                <span className="payIcon">
                  <img
                    src="/figma/2_1655/10.svg"
                    alt=""
                    aria-hidden="true"
                    className="iconImg"
                  />
                </span>
                <span>Pay Now</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .screen {
          min-height: 100svh;
          background: #ffffff;
          padding: clamp(10px, 4vw, 16px);
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }
        .header {
          display: grid;
          grid-template-columns: 24px 1fr 24px;
          align-items: center;
        }
        .title {
          margin: 0;
          text-align: left;
          color: #324a59;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 10;
          display: grid;
        }
        .scrim {
          position: absolute;
          inset: 0;
          background: rgba(29, 35, 53, 0.51);
        }
        .sheet {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          background: #ffffff;
          border-top-left-radius: 35px;
          border-top-right-radius: 35px;
          padding: 24px 20px 20px;
          box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.06);
        }
        .sheetTitle {
          margin: 4px 0 16px;
          color: #001833;
          font-size: 20px;
          font-weight: 600;
        }

        .storeRow {
          display: grid;
          grid-template-columns: 56px 1fr;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .storeIcon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #f5f8ff;
          display: grid;
          place-items: center;
        }
        .storeMeta {
          display: grid;
          gap: 2px;
        }
        .storeName {
          color: #001833;
          font-weight: 700;
          font-size: 14px;
        }
        .storeAddr {
          color: #8f98a3;
          font-size: 12px;
          line-height: 1.2;
        }

        .method {
          width: 100%;
          display: grid;
          grid-template-columns: 28px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 14px;
          margin: 10px 0;
          border-radius: 16px;
          background: #f7f8fb;
          border: 2px solid transparent;
          cursor: pointer;
          text-align: left;
        }
        .method:hover {
          border-color: rgba(50, 74, 89, 0.25);
        }
        .method.selected {
          border-color: #324a59;
          background: #ffffff;
        }
        .radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #324a59;
          display: grid;
          place-items: center;
        }
        .method:not(.selected) .radio .dot {
          display: none;
        }
        .radio .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #324a59;
        }
        .text {
          display: grid;
          gap: 2px;
        }
        .mTitle {
          color: #001833;
          font-weight: 700;
          font-size: 14px;
        }
        .mSub {
          color: #8f98a3;
          font-size: 12px;
        }
        .brand {
          display: grid;
          align-items: center;
          justify-items: end;
        }
        .cluster {
          grid-auto-flow: column;
          grid-auto-columns: max-content;
          gap: 8px;
        }
        .brandImg {
          display: block;
          height: 20px;
          width: auto;
          object-fit: contain;
        }

        .summary {
          margin-top: 18px;
          padding-top: 6px;
        }
        .row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          margin: 10px 0 24px;
        }
        .amountLabel {
          color: #6b7a8a;
          font-weight: 600;
          font-size: 12px;
        }
        .amountValue {
          color: #001833;
          font-weight: 700;
          font-size: 14px;
        }

        .ctaRow {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 14px;
        }
        .totalBlock .totalLabel {
          color: #b8bec6;
          font-weight: 600;
          font-size: 12px;
          margin-bottom: 6px;
        }
        .totalBlock .totalValue {
          color: #001833;
          font-weight: 800;
          font-size: 20px;
        }
        .payBtn {
          height: 52px;
          border: none;
          border-radius: 30px;
          background: #324a59;
          color: #fff;
          padding: 0 22px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          cursor: pointer;
          min-width: 180px;
        }
        .payBtn:active {
          transform: translateY(1px);
        }
        .payIcon {
          display: inline-grid;
          width: 22px;
          height: 22px;
          place-items: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
        }
        .iconImg {
          width: 14px;
          height: 14px;
          object-fit: contain;
          filter: invert(1);
        }

        @media (min-width: 768px) {
          .overlay .sheet {
            left: 50%;
            right: auto;
            width: min(480px, 92vw);
            transform: translateX(-50%);
            border-top-left-radius: 35px;
            border-top-right-radius: 35px;
          }
        }
      `}</style>
    </main>
  );
}