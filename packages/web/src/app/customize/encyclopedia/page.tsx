"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";

export default function EncyclopediaPage() {
  const [typeVal, setTypeVal] = useState(62);

  return (
    <main className={styles.screen} aria-label="Coffee lover encyclopedia">
      {/* Header */}
      <div className={styles.header}>
        <Link href="/customize" aria-label="Back">
          <img className={styles.icon} src="/figma/2_1912/4.svg" alt="" aria-hidden="true" />
        </Link>
        <div className={styles.title}>Coffee lover assemblage</div>
        <img className={styles.icon} src="/figma/2_1912/5.svg" alt="Cart" />
      </div>

      {/* Section title */}
      <div className={styles.section}>Select a barista</div>

      {/* Body rows (condensed to match canvas) */}
      <div className={styles.list}>
        {/* Coffee type with slider */}
        <div className={styles.row}>
          <div className={styles.label}>Coffee type</div>
          <span />
        </div>
        <div className={styles.sliderWrap}>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={100}
            value={typeVal}
            onChange={(e)=>setTypeVal(parseInt(e.target.value,10))}
            aria-label="Coffee type (Arabica to Robusta)"
          />
          <div className={styles.sliderHints}>
            <span>Arabica</span>
            <span>Robusta</span>
          </div>
        </div>

        {/* Coffee sort */}
        <div className={styles.row}>
          <div className={styles.label}>Coffee sort</div>
          <img className={styles.chev} src="/figma/2_1912/15.svg" alt="" aria-hidden="true" />
        </div>

        {/* Roasting */}
        <div className={styles.row}>
          <div className={styles.label}>Roasting</div>
          <div className={styles.inline} aria-hidden="true">
            <img className={styles.flame} src="/figma/2_1912/7.svg" alt="" />
            <img className={styles.flame} src="/figma/2_1912/7.svg" alt="" />
            <img className={styles.flame} src="/figma/2_1912/7.svg" alt="" />
            <img className={styles.flameSolid} src="/figma/2_1912/11.svg" alt="" />
            <img className={styles.flameSolid} src="/figma/2_1912/11.svg" alt="" />
          </div>
        </div>

        {/* Grinding */}
        <div className={styles.row}>
          <div className={styles.label}>Grinding</div>
          <div className={styles.inline} aria-hidden="true">
            <img className={styles.beanActive} src="/figma/2_1912/13.svg" alt="" />
            <img className={styles.bean} src="/figma/2_1912/12.svg" alt="" />
          </div>
        </div>

        {/* Milk */}
        <div className={styles.row}>
          <div className={styles.label}>Milk</div>
          <div className={styles.right}>Select</div>
        </div>

        {/* Syrup */}
        <div className={styles.row}>
          <div className={styles.label}>Syrup</div>
          <div className={styles.right}>Select</div>
        </div>
      </div>

      {/* Bottom encyclopedia card */}
      <div className={styles.cardWrap}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Coffee lover's encyclopedia</div>
          <p className={styles.cardText}>
            A blend of 90% Arabica and 10% Robusta is considered a classic Italian
            espresso. We do not recommend creating a blend with a robusta content of
            more than 30%.
          </p>
          <div className={styles.dots}>
            <span className={styles.dotActive} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <div className={styles.cardNav}>
            <span>Skip</span>
            <span>Next</span>
          </div>
        </div>
      </div>
    </main>
  );
}