"use client";

import styles from "./page.module.css";
import { useState } from "react";
import Link from "next/link";

type Barista = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  statusDot: string; // green or red dot svg
  disabled?: boolean;
};

const BARISTAS: Barista[] = [
  {
    id: "victor",
    name: "Victor",
    role: "Top barista",
    avatar: "/figma/2_2196/6.svg",
    statusDot: "/figma/2_2196/13.svg",
  },
  {
    id: "andrey",
    name: "Andrey",
    role: "Top barista",
    avatar: "/figma/2_2196/7.svg",
    statusDot: "/figma/2_2196/13.svg",
  },
  {
    id: "vera",
    name: "Vera",
    role: "Barista",
    avatar: "/figma/2_2196/8.svg",
    statusDot: "/figma/2_2196/14.svg",
    disabled: true,
  },
];

export default function SelectBaristaPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className={styles.screen} aria-label="Select a barista">
      {/* Header */}
      <div className={styles.header}>
        <Link href="/customize" aria-label="Back">
          <img className={styles.back} src="/figma/2_2196/4.svg" alt="" aria-hidden="true" />
        </Link>
        <div className={styles.title}>Coffee lover assemblage</div>
        <img className={styles.cart} src="/figma/2_2196/5.svg" alt="Cart" />
      </div>

      {/* Section title */}
      <div className={styles.sectionTitle}>Select a barista</div>

      {/* List */}
      <div className={styles.list}>
        {BARISTAS.map((b) => {
          const isSelected = selected === b.id;
          return (
            <button
              key={b.id}
              type="button"
              className={`${styles.card} ${isSelected ? styles.selected : ""}`}
              onClick={() => setSelected(b.id)}
              aria-pressed={isSelected}
              aria-label={`${b.name}, ${b.role}${b.disabled ? " (unavailable)" : ""}`}
            >
              <img className={styles.avatar} src={b.avatar} alt="" aria-hidden="true" />
              <div className={styles.meta}>
                <div className={`${styles.name} ${b.disabled ? styles.nameMuted : ""}`}>{b.name}</div>
                <div className={styles.role}>{b.role}</div>
              </div>
              <img className={styles.statusDot} src={b.statusDot} alt="" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* Bottom navigation */}
      <div className={styles.bottomNavWrap} aria-hidden="false">
        <nav className={styles.bottomNav} aria-label="Bottom navigation">
          <img className={`${styles.navIcon} ${styles.navIconActive}`} src="/figma/2_2196/9.svg" alt="Home" />
          <img className={styles.navIcon} src="/figma/2_2196/10.svg" alt="Gifts" />
          <img className={styles.navIcon} src="/figma/2_2196/11.svg" alt="Orders" />
        </nav>
      </div>
    </main>
  );
}