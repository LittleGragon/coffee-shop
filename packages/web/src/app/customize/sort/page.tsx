"use client";

import styles from "./page.module.css";
import Link from "next/link";

const COUNTRIES = [
  "Brazil",
  "Colombia",
  "Costa Rica",
  "Jamaica",
  "Yemen",
  "Kenya",
  "India",
  "Tanzania",
  "Hawaii",
  "Indonesia",
  "Ethiopia",
];

export default function SortPage() {
  return (
    <main className={styles.screen} aria-label="Select country and sort of coffee">
      <div className={styles.header}>
        <Link href="/customize" aria-label="Back">
          <img className={styles.icon} src="/figma/2_2135/4.svg" alt="" aria-hidden="true" />
        </Link>
        <div className={styles.title}>Coffee lover assemblage</div>
        <img className={styles.icon} src="/figma/2_2135/5.svg" alt="Cart" />
      </div>

      <div className={styles.section}>Select country and sort of coffee</div>

      <div className={styles.list} role="list">
        {COUNTRIES.map((c, i) => (
          <div key={c} role="listitem">
            <div className={styles.row}>
              <span className={`${styles.label} ${i === 0 ? styles.active : ""}`}>{c}</span>
              <img
                className={styles.chevron}
                src={`/figma/2_2135/${9 + i}.svg`}
                alt=""
                aria-hidden="true"
              />
            </div>
            {i < COUNTRIES.length - 1 && <div className="divider" />}
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <nav className={styles.nav} aria-label="Bottom navigation">
          <img className={`${styles.navIcon} ${styles.activeNav}`} src="/figma/2_2135/6.svg" alt="Home" />
          <img className={styles.navIcon} src="/figma/2_2135/7.svg" alt="Gifts" />
          <img className={styles.navIcon} src="/figma/2_2135/8.svg" alt="Orders" />
        </nav>
      </div>
    </main>
  );
}