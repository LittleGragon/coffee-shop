"use client";

import styles from "./page.module.css";
import { useMemo, useState } from "react";

type Volume = 250 | 350 | 450;
type Ristretto = "one" | "two";
type Service = "onsite" | "takeaway";

export default function OrderPage() {
  const [qty, setQty] = useState(1);
  const [ristretto, setRistretto] = useState<Ristretto>("one");
  const [service, setService] = useState<Service>("takeaway");
  const [volume, setVolume] = useState<Volume>(350);
  const [schedEnabled, setSchedEnabled] = useState(true);
  const [time, setTime] = useState("18:10");

  // Simple pricing model matching BYN 3.00 base for 350ml
  const total = useMemo(() => {
    const baseByVolume: Record<Volume, number> = { 250: 2.7, 350: 3.0, 450: 3.5 };
    let price = baseByVolume[volume];
    if (ristretto === "two") price += 0.3;
    return (price * qty).toFixed(2);
  }, [qty, ristretto, volume]);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  return (
    <main className={styles.screen} aria-label="Order">
      {/* Header */}
      <div className={styles.header}>
        <a href="/menu" aria-label="Back">
          <img className={styles.back} src="/figma/2_2548/4.svg" alt="" aria-hidden="true" />
        </a>
        <div className={styles.title}>Order</div>
        <div className={styles.headerRight}>
          <img className={styles.icon} src="/figma/2_2548/5.svg" alt="Cart" />
        </div>
      </div>

      {/* Product image card */}
      <section className={styles.imgCard}>
        <img className={styles.productImg} src="/figma/2_2548/11.png" alt="Cappuccino" />
      </section>

      {/* Cappuccino + stepper */}
      <div className={styles.row}>
        <div className={styles.label}>Cappuccino</div>
        <div className={styles.stepper} role="group" aria-label="Quantity">
          <button type="button" className={styles.stepBtn} onClick={dec} aria-label="Decrease">-</button>
          <span className={styles.stepVal} aria-live="polite">{qty}</span>
          <button type="button" className={styles.stepBtn} onClick={inc} aria-label="Increase">+</button>
        </div>
      </div>
      <div className={styles.divider} />

      {/* Ristretto segmented */}
      <div className={styles.row}>
        <div className={styles.label}>Ristretto</div>
        <div className={styles.segment}>
          <button
            type="button"
            className={`${styles.segmentBtn} ${ristretto === "one" ? styles.segmentActive : ""}`}
            onClick={() => setRistretto("one")}
          >
            One
          </button>
          <button
            type="button"
            className={`${styles.segmentBtn} ${ristretto === "two" ? styles.segmentActive : ""}`}
            onClick={() => setRistretto("two")}
          >
            Two
          </button>
        </div>
      </div>
      <div className={styles.divider} />

      {/* Onsite / Takeaway */}
      <div className={styles.row}>
        <div className={styles.label}>Onsite / Takeaway</div>
        <div className={styles.options}>
          <img
            className={`${styles.optionIcon} ${service === "onsite" ? styles.optionActive : ""}`}
            src="/figma/2_2548/6.svg"
            alt="Onsite"
            onClick={() => setService("onsite")}
          />
          <img
            className={`${styles.optionIcon} ${service === "takeaway" ? styles.optionActive : ""}`}
            src="/figma/2_2548/7.svg"
            alt="Takeaway"
            onClick={() => setService("takeaway")}
          />
        </div>
      </div>
      <div className={styles.divider} />

      {/* Volume */}
      <div className={styles.row}>
        <div className={styles.label}>Volume, ml</div>
        <div className={styles.volumeIcons}>
          <div
            className={`${styles.vol} ${volume === 250 ? styles.volActive : ""}`}
            onClick={() => setVolume(250)}
            role="button"
            aria-label="250 ml"
          >
            <img className={styles.volIcon} src="/figma/2_2548/8.svg" alt="" aria-hidden="true" />
            <div className={styles.volLabel}>250</div>
          </div>
          <div
            className={`${styles.vol} ${volume === 350 ? styles.volActive : ""}`}
            onClick={() => setVolume(350)}
            role="button"
            aria-label="350 ml"
          >
            <img className={styles.volIcon} src="/figma/2_2548/9.svg" alt="" aria-hidden="true" />
            <div className={styles.volLabel}>350</div>
          </div>
          <div
            className={`${styles.vol} ${volume === 450 ? styles.volActive : ""}`}
            onClick={() => setVolume(450)}
            role="button"
            aria-label="450 ml"
          >
            <img className={styles.volIcon} src="/figma/2_2548/10.svg" alt="" aria-hidden="true" />
            <div className={styles.volLabel}>450</div>
          </div>
        </div>
      </div>
      <div className={styles.divider} />

      {/* Prepare by time */}
      <div className={`${styles.row} ${styles.timeRow}`}>
        <div className={styles.label}>Prepare by a certain time today?</div>
        <label className={styles.switch} aria-label="Schedule time">
          <input
            type="checkbox"
            checked={schedEnabled}
            onChange={(e) => setSchedEnabled(e.target.checked)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.row} style={{ paddingTop: 0 }}>
        <div />
        <div className={styles.timeChip} aria-hidden={!schedEnabled}>
          {time}
        </div>
      </div>

      {/* Promo */}
      <div className={styles.row} style={{ paddingTop: 0 }}>
        <div />
        <div className={styles.promo}>
          <img className={styles.promoIcon} src="/figma/2_2548/14.svg" alt="" aria-hidden="true" />
          <div className={styles.promoText}>Coffee lover assemblage</div>
          <img className={styles.chev} src="/figma/2_2548/13.svg" alt="" aria-hidden="true" />
        </div>
      </div>

      {/* Total + Next */}
      <div className={styles.totalRow}>
        <div className={styles.totalLabel}>Total Amount</div>
        <div className={styles.totalAmount}>BYN {total}</div>
      </div>
      <button className={styles.nextBtn} type="button">Next</button>
    </main>
  );
}