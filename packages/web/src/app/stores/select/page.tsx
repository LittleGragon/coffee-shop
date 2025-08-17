export const dynamic = "force-static";
import styles from "./page.module.css";

type Store = {
  name: string;
  icon: string;
  arrow: string;
  href?: string;
};

const stores: Store[] = [
  { name: "Bradford BD1 1PR", icon: "/figma/2_2738/12.svg", arrow: "/figma/2_2738/17.svg" },
  { name: "Bradford BD4 7SJ", icon: "/figma/2_2738/14.svg", arrow: "/figma/2_2738/18.svg" },
  { name: "Bradford BD1 4RN", icon: "/figma/2_2738/16.svg", arrow: "/figma/2_2738/19.svg" },
];

export default function SelectStorePage() {
  return (
    <main className={styles.screen} aria-label="Select Magic Coffee store">
      {/* Map background */}
      <div className={styles.map} aria-hidden="true">
        <img
          className={styles.mapImg}
          src="/figma/2_2738/1.png"
          alt=""
          aria-hidden="true"
        />
      </div>

      {/* Back */}
      <a href="/onboarding" aria-label="Go back" className={styles.backBtn}>
        <img src="/figma/2_2738/10.svg" alt="" aria-hidden="true" />
      </a>

      {/* Pins/controls (positions from Figma) */}
      <img className={`${styles.marker} ${styles.pinHome}`} src="/figma/2_2738/5.svg" alt="Home pin" />
      <img className={`${styles.marker} ${styles.pinUser}`} src="/figma/2_2738/6.svg" alt="User pin" />
      <img className={`${styles.marker} ${styles.pinGear}`} src="/figma/2_2738/7.svg" alt="Tools" />

      {/* Bottom sheet */}
      <section className={styles.sheet} aria-labelledby="sheet-title">
        <div className={styles.sheetHeader}>
          <span id="sheet-title">Select Magic Coffee store</span>
        </div>

        <div className={styles.sheetBody}>
          {stores.map((s) => (
            <a key={s.name} href={s.href || "#"} className={styles.row} aria-label={`Choose ${s.name}`}>
              <img className={styles.icon} src={s.icon} alt="" aria-hidden="true" />
              <span className={styles.rowText}>{s.name}</span>
              <img className={styles.chev} src={s.arrow} alt="" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}