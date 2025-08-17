"use client";

import styles from "./page.module.css";
import Link from "next/link";

const SORTS = ["Santos","Bourbon santos","Minas","Rio","Canilon","Flat beat"];

export default function BrazilSortPage() {
  return (
    <main className={styles.screen} aria-label="Select coffee sort">
      {/* Header */}
      <div className={styles.header}>
        <Link href="/customize/sort" aria-label="Back">
          <img className={styles.icon} src="/figma/2_2135/4.svg" alt="" aria-hidden="true" />
        </Link>
        <div className={styles.title}>Select country</div>
        <img className={styles.icon} src="/figma/2_2135/5.svg" alt="Cart" />
      </div>

      {/* Subtitle */}
      <div className={styles.section}>Select a sort of coffee</div>

      {/* Sort list */}
      <div className={styles.list} role="list">
        {SORTS.map((name, i) => (
          <div key={name} className={styles.row} role="listitem">
            <span className={`${styles.label} ${i===0?styles.active:""}`}>{name}</span>
          </div>
        ))}
      </div>

      {/* Bottom navigation */}
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