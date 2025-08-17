"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function SyrupSheetPage() {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const options = ["None", "Amaretto", "Coconut", "Vanilla", "Caramel"];

  return (
    <main className={styles.screen} aria-label="Syrup flavor bottom sheet preview">
      {open && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <section
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="syrupTitle"
          >
            <div id="syrupTitle" className={styles.sheetHeader}>
              What flavor of syrup do you prefer?
            </div>
            {options.map((o) => (
              <button
                key={o}
                type="button"
                className={styles.option}
                aria-pressed={selected === o}
                onClick={() => setSelected(o)}
              >
                {o}
              </button>
            ))}
          </section>

          <button type="button" className={styles.cancel} onClick={() => setOpen(false)}>
            Cancel
          </button>
        </>
      )}
    </main>
  );
}