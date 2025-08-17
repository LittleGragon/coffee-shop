"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/src/lib/api-client";

type ApiOrder = {
  id: string;
  total_amount: number;
  status: string;
  order_type: string;
  created_at: string;
  item_count: number;
};

type UiOrderItem = {
  id: string;
  name: string;
  date: string; // e.g., "24 June | 12:30 | by 18:10"
  location: string;
  price: string; // "BYN 3.00"
};

const fallback: UiOrderItem[] = [
  {
    id: "americano",
    name: "Americano",
    date: "24 June | 12:30 | by 18:10",
    location: "Bradford BD1 1PR",
    price: "BYN 3.00",
  },
  {
    id: "latte",
    name: "Latte",
    date: "24 June | 12:30 | by 18:10",
    location: "Bradford BD1 1PR",
    price: "BYN 3.00",
  },
  {
    id: "flat-white",
    name: "Flat White",
    date: "24 June | 12:30 | by 18:10",
    location: "Bradford BD1 1PR",
    price: "BYN 3.00",
  },
];

export default function OrdersPage() {
  const activeTab: "ongoing" | "history" = "ongoing";
  const [items, setItems] = useState<UiOrderItem[]>(fallback);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiFetch<{ success: true; orders: ApiOrder[] }>("/api/orders");
        const ui = (res.orders || []).map<UiOrderItem>((o) => {
          const d = new Date(o.created_at);
          const dateStr = `${d.toLocaleDateString(undefined, {
            month: "long",
            day: "2-digit",
          })} | ${d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
          // Name is not returned by API yet (requires join); use generic label
          return {
            id: o.id,
            name: "Order",
            date: dateStr,
            location: "Bradford BD1 1PR",
            price: `BYN ${o.total_amount.toFixed(2)}`,
          };
        });
        if (mounted && ui.length) setItems(ui);
      } catch {
        // ignore; keep fallback for unauthenticated users
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="screen" aria-label="My Order">
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
        <h1 className="title">My Order</h1>
        <span />
      </header>

      {/* Tabs */}
      <nav className="tabs" role="tablist" aria-label="Order tabs">
        <button
          role="tab"
          aria-selected={activeTab === "ongoing"}
          className={"tab" + (activeTab === "ongoing" ? " active" : "")}
        >
          On going
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "history"}
          className={"tab" + (activeTab === "history" ? " active" : "")}
          disabled
          title="Not implemented"
        >
          History
        </button>
      </nav>

      {/* List */}
      <section className="list" aria-label="On going orders">
        {items.map((o) => (
          <article key={o.id} className="card">
            <div className="left">
              <div className="date">{o.date}</div>
              <div className="nameRow">
                <img
                  src="/figma/2_1265/8.svg"
                  alt=""
                  aria-hidden="true"
                  className="miniIcon"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
                <span className="name">{o.name}</span>
              </div>
              <div className="locRow">
                <img
                  src="/figma/2_1265/12.svg"
                  alt=""
                  aria-hidden="true"
                  className="miniIcon"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
                <span className="loc">{o.location}</span>
              </div>
            </div>
            <div className="price">{o.price}</div>
          </article>
        ))}
      </section>

      {/* Bottom Nav */}
      <nav className="bottomNav" aria-label="Primary">
        <a className="navBtn" href="/stores/select" aria-label="Stores">
          <img src="/figma/2_1265/10.svg" alt="" aria-hidden="true" />
        </a>
        <a className="navBtn" href="/rewards" aria-label="Rewards">
          <img src="/figma/2_1265/11.svg" alt="" aria-hidden="true" />
        </a>
        <a className="navBtn active" href="/orders" aria-current="page" aria-label="Orders">
          <img src="/figma/2_1265/12.svg" alt="" aria-hidden="true" />
        </a>
      </nav>

      <style jsx>{`
        .screen {
          min-height: 100svh;
          background: #ffffff;
          padding: clamp(10px, 4vw, 16px);
          padding-bottom: 98px; /* space for bottom nav */
          display: grid;
          grid-template-rows: auto auto 1fr;
          gap: 12px;
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

        .tabs {
          display: grid;
          grid-auto-flow: column;
          justify-content: start;
          gap: 24px;
          padding: 0 4px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .tab {
          position: relative;
          padding: 10px 0 12px;
          background: transparent;
          border: none;
          color: #9aa6b2;
          font-weight: 600;
          cursor: default;
        }
        .tab.active {
          color: #324a59;
        }
        .tab.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: #324a59;
          border-radius: 2px;
        }
        .tab[disabled] {
          opacity: 0.5;
        }

        .list {
          display: grid;
        }
        .card {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          padding: 14px 0;
          border-bottom: 1px solid #f4f5f7;
        }
        .left {
          display: grid;
          gap: 8px;
        }
        .date {
          color: rgba(50, 74, 89, 0.22);
          font-size: 12px;
          font-weight: 600;
        }
        .nameRow,
        .locRow {
          display: grid;
          grid-template-columns: 16px 1fr;
          align-items: center;
          gap: 8px;
        }
        .miniIcon {
          width: 16px;
          height: 16px;
          object-fit: contain;
          opacity: 0.85;
        }
        .name {
          color: #324a59;
          font-size: 14px;
          font-weight: 600;
        }
        .loc {
          color: #324a59;
          font-size: 12px;
          opacity: 0.8;
        }
        .price {
          align-self: start;
          color: #324a59;
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
        }

        .bottomNav {
          position: fixed;
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%);
          width: min(340px, 92vw);
          height: 64px;
          background: #ffffff;
          box-shadow: 0 4px 50px rgba(50, 74, 89, 0.12);
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
          .tabs,
          .list {
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