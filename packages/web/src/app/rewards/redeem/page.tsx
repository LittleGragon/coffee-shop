"use client";

type RedeemItem = {
  name: string;
  img: string;
  expires: string;
  pts: number;
};

const items: RedeemItem[] = [
  { name: "Latte", img: "/figma/2_1348/2.png", expires: "Valid until 04.07.21", pts: 1340 },
  { name: "Flat White", img: "/figma/2_1348/4.png", expires: "Valid until 04.07.21", pts: 1340 },
  { name: "Cappuccino", img: "/figma/2_1348/6.png", expires: "Valid until 04.07.21", pts: 1340 },
];

export default function RedeemPage() {
  return (
    <main className="screen" aria-label="Redeem rewards">
      {/* Header */}
      <header className="header">
        <a href="/rewards" className="back" aria-label="Back">
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
        <h1 className="title">Redeem</h1>
        <span />
      </header>

      {/* List */}
      <section className="list" aria-label="Redeemable drinks">
        {items.map((it) => (
          <article key={it.name} className="row" aria-label={it.name}>
            <div className="thumbWrap">
              <img
                className="thumb"
                src={it.img}
                alt={it.name}
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </div>
            <div className="meta">
              <div className="name">{it.name}</div>
              <div className="sub">{it.expires}</div>
            </div>
            <div className="pill" aria-label={`${it.pts} points`}>
              {it.pts} pts
            </div>
          </article>
        ))}
      </section>

      <style jsx>{`
        .screen {
          min-height: 100svh;
          background: #ffffff;
          padding: clamp(10px, 4vw, 16px);
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 8px;
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
          letter-spacing: 0.2px;
        }

        .list {
          display: grid;
        }
        .row {
          display: grid;
          grid-template-columns: 56px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f4f5f7;
        }
        .thumbWrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #f7f8fb;
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .thumb {
          width: 48px;
          height: 48px;
          object-fit: contain;
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
        .sub {
          color: rgba(50, 74, 89, 0.22);
          font-size: 12px;
        }
        .pill {
          background: #324a59;
          color: #ffffff;
          font-weight: 600;
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 20px;
          white-space: nowrap;
        }

        @media (min-width: 768px) {
          .screen {
            grid-template-columns: 1fr minmax(360px, 480px) 1fr;
          }
          .header,
          .list {
            grid-column: 2;
          }
        }
      `}</style>
    </main>
  );
}