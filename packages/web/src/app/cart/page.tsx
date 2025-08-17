"use client";

import { useMemo, useState } from "react";

type Item = {
  id: string;
  name: string;
  img: string;
  options: string;
  qty: number;
  price: number; // BYN
};

const initialItems: Item[] = [
  {
    id: "americano",
    name: "Americano",
    img: "/figma/2_1839/7.png",
    options: "single | iced | medium | full ice",
    qty: 1,
    price: 3.0,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    img: "/figma/2_1839/8.png",
    options: "single | iced | medium | full ice",
    qty: 1,
    price: 3.0,
  },
  {
    id: "flat-white",
    name: "Flat White",
    img: "/figma/2_1839/9.png",
    options: "single | iced | medium | full ice",
    qty: 1,
    price: 3.0,
  },
];

export default function CartPage() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <main className="screen" aria-label="My order">
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
        <h1 className="title">My order</h1>
        <span />
      </header>

      {/* Items */}
      <section className="list">
        {items.map((it, idx) => (
          <article key={it.id} className="card" aria-label={it.name}>
            <img className="thumb" src={it.img} alt={it.name} />
            <div className="meta">
              <div className="name">{it.name}</div>
              <div className="opts">{it.options}</div>
              <div className="qty">x {it.qty}</div>
            </div>
            <div className="price">
              <div className="ccy">BYN</div>
              <div className="val">{it.price.toFixed(2)}</div>
            </div>
            <button
              type="button"
              className={`trash ${idx === 1 ? "accent" : ""}`}
              onClick={() => remove(it.id)}
              aria-label={`Remove ${it.name}`}
              title="Remove"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10Z"
                  fill="none"
                  stroke="#D03C3C"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </article>
        ))}
        {items.length === 0 && (
          <p className="empty">Your cart is empty.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="footer" aria-live="polite">
        <div className="totalBlock">
          <div className="label">Total Price</div>
          <div className="total">BYN {total.toFixed(2)}</div>
        </div>
        <button className="nextBtn" disabled={items.length === 0}>
          <svg className="cartIcon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6h15l-2 9H8L6 3H2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="21" r="1.5" />
            <circle cx="18" cy="21" r="1.5" />
          </svg>
          <span>Next</span>
        </button>
      </footer>

      <style jsx>{`
        .screen {
          min-height: 100svh;
          background: #fff;
          padding: clamp(10px, 4vw, 16px);
          padding-bottom: 120px; /* space for footer */
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 12px;
        }
        .header {
          display: grid;
          grid-template-columns: 24px 1fr 24px;
          align-items: center;
          gap: 10px;
        }
        .title {
          margin: 0;
          text-align: left;
          color: #324a59;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }
        .list {
          display: grid;
          gap: 14px;
        }
        .card {
          display: grid;
          grid-template-columns: 72px 1fr auto 44px;
          align-items: center;
          gap: 12px;
          background: #f7fbff;
          border-radius: 16px;
          padding: 10px;
        }
        .thumb {
          width: 72px;
          height: 72px;
          object-fit: contain;
          border-radius: 12px;
          background: #fff;
        }
        .meta {
          display: grid;
          gap: 4px;
        }
        .name {
          color: #001833;
          font-weight: 600;
          font-size: 14px;
        }
        .opts {
          color: #8f98a3;
          font-size: 12px;
          line-height: 1.2;
        }
        .qty {
          color: #8f98a3;
          font-size: 12px;
        }
        .price {
          justify-self: end;
          text-align: right;
          color: #001833;
        }
        .ccy {
          font-size: 12px;
          opacity: 0.8;
        }
        .val {
          font-weight: 700;
          font-size: 16px;
        }
        .trash {
          width: 44px;
          height: 64px;
          border: none;
          background: transparent;
          border-radius: 12px;
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        .trash:hover {
          background: rgba(208, 60, 60, 0.08);
        }
        .trash.accent {
          background: rgba(208, 60, 60, 0.12);
        }
        .empty {
          color: #8f98a3;
          text-align: center;
          padding: 40px 0;
        }
        .footer {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 12px 16px 20px;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 30%, #fff 100%);
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 12px;
        }
        .totalBlock .label {
          color: #b8bec6;
          font-weight: 600;
          font-size: 12px;
          margin-bottom: 6px;
        }
        .totalBlock .total {
          color: #001833;
          font-weight: 800;
          font-size: 18px;
        }
        .nextBtn {
          height: 52px;
          border: none;
          border-radius: 28px;
          background: #324a59;
          color: #fff;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          cursor: pointer;
          min-width: 160px;
        }
        .nextBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .cartIcon {
          display: block;
        }

        @media (min-width: 768px) {
          .screen {
            grid-template-columns: 1fr minmax(360px, 430px) 1fr;
          }
          .header,
          .list {
            grid-column: 2;
          }
          .footer {
            left: 50%;
            right: auto;
            width: min(430px, 92vw);
            transform: translateX(-50%);
            background: transparent;
          }
        }
      `}</style>
    </main>
  );
}