"use client";

import styles from "./page.module.css";
import { useState } from "react";

export default function CustomizePage() {
  // Coffee type slider (0 Arabica ... 100 Robusta)
  const [typeVal, setTypeVal] = useState(62);
  // Roasting flames 1..5 (visual state)
  const [roast, setRoast] = useState(4);
  // Grinding option
  const [grind, setGrind] = useState<"ground" | "beans">("ground");
  // Ice matrix (6 cells for demo)
  const [ice, setIce] = useState<Record<number, boolean>>({ 0: false, 1: false, 2: false, 3: false, 4: false, 5: false });

  const toggleIce = (i: number) => setIce((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <main className={styles.screen} aria-label="Coffee lover assemblage">
      {/* Header */}
      <div className={styles.header}>
        <a href="/order" aria-label="Back">
          <img className={styles.back} src="/figma/2_2460/4.svg" alt="" aria-hidden="true" />
        </a>
        <div className={styles.title}>Coffee lover assemblage</div>
        <div className={styles.headerRight}>
          <img src="/figma/2_2460/5.svg" alt="Cart" />
        </div>
      </div>

      {/* Body */}
      <section className={styles.block}>
        {/* Select a barista */}
        <div className={styles.row}>
          <div className={styles.label}>Select a barista</div>
          <img className={styles.chevron} src="/figma/2_2460/14.svg" alt="" aria-hidden="true" />
        </div>
        <div className={styles.divider} />

        {/* Coffee type slider */}
        <div className={styles.row} style={{ alignItems: "start" }}>
          <div className={styles.label}>Coffee type</div>
          <div className={styles.sliderWrap} style={{ width: "72%" }}>
            <input
              className={styles.slider}
              type="range"
              min={0}
              max={100}
              value={typeVal}
              onChange={(e) => setTypeVal(parseInt(e.target.value, 10))}
              aria-label="Coffee type (Arabica to Robusta)"
            />
            <div className={styles.sliderHints}>
              <span>Arabica</span>
              <span>Robusta</span>
            </div>
          </div>
        </div>
        <div className={styles.divider} />

        {/* Coffee sort */}
        <div className={styles.row}>
          <div className={styles.label}>Coffee sort</div>
          <img className={styles.chevron} src="/figma/2_2460/15.svg" alt="" aria-hidden="true" />
        </div>
        <div className={styles.divider} />

        {/* Roasting */}
        <div className={styles.row}>
          <div className={styles.label}>Roasting</div>
          <div className={styles.flames} role="radiogroup" aria-label="Roasting level">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src="/figma/2_2460/7.svg"
                alt={i <= roast ? `Roast level ${i} selected` : `Roast level ${i}`}
                className={`${styles.flame} ${i <= roast ? styles.flameActive : ""}`}
                onClick={() => setRoast(i)}
                role="radio"
                aria-checked={i === roast}
              />
            ))}
          </div>
        </div>
        <div className={styles.divider} />

        {/* Grinding */}
        <div className={styles.row}>
          <div className={styles.label}>Grinding</div>
          <div className={styles.grinding} role="radiogroup" aria-label="Grinding">
            <img
              src="/figma/2_2460/13.svg"
              alt="Ground"
              className={`${styles.bean} ${grind === "ground" ? styles.beanActive : ""}`}
              onClick={() => setGrind("ground")}
              role="radio"
              aria-checked={grind === "ground"}
            />
            <img
              src="/figma/2_2460/13.svg"
              alt="Beans"
              className={`${styles.bean} ${grind === "beans" ? styles.beanActive : ""}`}
              onClick={() => setGrind("beans")}
              role="radio"
              aria-checked={grind === "beans"}
              style={{ opacity: grind === "beans" ? 1 : 0.35, filter: grind === "beans" ? "none" : "grayscale(100%)" }}
            />
          </div>
        </div>
        <div className={styles.divider} />

        {/* Milk */}
        <div className={styles.row}>
          <div className={styles.label}>Milk</div>
          <div className={styles.selectText}>Select</div>
        </div>
        <div className={styles.divider} />

        {/* Syrup */}
        <div className={styles.row}>
          <div className={styles.label}>Syrup</div>
          <div className={styles.selectText}>Select</div>
        </div>
        <div className={styles.divider} />

        {/* Additives */}
        <div className={styles.row}>
          <div className={styles.label}>Additives</div>
          <img className={styles.chevron} src="/figma/2_2460/16.svg" alt="" aria-hidden="true" />
        </div>

        {/* Ice (simple checkbox grid as placeholders) */}
        <div className={styles.iceRow}>
          <div className={styles.label} style={{ color: "#D8D8D8" }}>Ice</div>
          <div className={styles.iceGrid} role="group" aria-label="Ice options">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={`${styles.iceBox} ${ice[i] ? styles.iceBoxChecked : ""}`}
                role="checkbox"
                aria-checked={!!ice[i]}
                onClick={() => toggleIce(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer total + next */}
      <div className={styles.totalRow}>
        <div className={styles.totalLabel}>Total Amount</div>
        <div className={styles.totalAmount}>BYN 9.00</div>
      </div>
      <button type="button" className={styles.nextBtn}>Next</button>
    </main>
  );
}