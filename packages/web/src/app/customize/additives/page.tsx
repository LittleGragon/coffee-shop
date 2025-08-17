"use client";

import Link from "next/link";
import { useState } from "react";

const ADDITIVES = [
  "Ceylon cinnamon",
  "Grated chocolate",
  "Liquid chocolate",
  "Marshmallow",
  "Whipped cream",
  "Cream",
  "Nutmeg",
  "Ice cream",
];

export default function AdditivesPage() {
  const [selected, setSelected] = useState<string[]>(["Ceylon cinnamon", "Marshmallow"]);
  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  return (
    <main className="screen" aria-label="Select additives">
      {/* Header */}
      <div className="header">
        <Link href="/customize" aria-label="Back">
          <img className="icon" src="/figma/2_2135/4.svg" alt="" aria-hidden="true" />
        </Link>
        <div className="title">Coffee lover assemblage</div>
        <img className="icon" src="/figma/2_2135/5.svg" alt="Cart" />
      </div>

      {/* Subtitle */}
      <div className="section">Select additives</div>

      {/* List */}
      <div className="list" role="list">
        {ADDITIVES.map((name) => {
          const isActive = selected.includes(name);
          return (
            <button
              key={name}
              type="button"
              className="row"
              role="listitem"
              aria-pressed={isActive}
              onClick={() => toggle(name)}
            >
              <span className={`label ${isActive ? "active" : ""}`}>{name}</span>
              {isActive ? (
                <svg className="check" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M20 6L9 17l-5-5"
                    fill="none"
                    stroke="#0A84FF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="spacer" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div className="bottom">
        <nav className="nav" aria-label="Bottom navigation">
          <img className="navIcon activeNav" src="/figma/2_2135/6.svg" alt="Home" />
          <img className="navIcon" src="/figma/2_2135/7.svg" alt="Gifts" />
          <img className="navIcon" src="/figma/2_2135/8.svg" alt="Orders" />
        </nav>
      </div>

      <style jsx>{`
        .screen { min-height: 100svh; background: #fff; display: grid; grid-template-rows: auto auto 1fr; gap: 10px; padding: 12px 16px 96px; }
        .header { display: grid; grid-template-columns: 24px 1fr 24px; align-items: center; gap: 10px; margin-top: 6px; }
        .icon { width: 24px; height: 24px; }
        .title { text-align: center; color: #001833; font-weight: 500; font-size: 16px; }
        .section { color: #001833; font-size: 16px; font-weight: 500; margin-top: 8px; }
        .list { margin-top: 6px; }
        .row { width: 100%; height: 44px; display: grid; grid-template-columns: 1fr 24px; align-items: center; gap: 8px; padding: 0 4px; border-bottom: 1px solid #E0E0E2; background: #fff; cursor: pointer; }
        .label { font-size: 17px; color: #000; text-align: left; }
        .active { color: #0A84FF; }
        .check { width: 20px; height: 20px; justify-self: end; }
        .spacer { width: 20px; height: 20px; }
        .bottom { position: fixed; left: 26px; right: 26px; bottom: 20px; }
        .nav { height: 64px; background: #fff; border-radius: 20px; box-shadow: 0 4px 50px rgba(0,0,0,.12); display: grid; grid-template-columns: repeat(3,1fr); align-items: center; justify-items: center; }
        .navIcon { width: 24px; height: 24px; opacity: .35; }
        .activeNav { opacity: 1; }
        @media (min-width: 768px) {
          .screen { grid-template-columns: 1fr minmax(360px, 430px) 1fr; }
          .header, .section, .list { grid-column: 2; }
          .bottom { left: 50%; right: auto; transform: translateX(-50%); width: min(430px, 92vw); }
        }
      `}</style>
    </main>
  );
}