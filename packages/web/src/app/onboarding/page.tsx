import Image from "next/image";
import styles from "./page.module.css";
import { Reenie_Beanie } from "next/font/google";

const reenie = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
});

export default function OnboardingPage() {
  return (
    <main className={styles.screen} aria-label="Onboarding screen">
      <section className={styles.hero}>
        {/* Logo badge from export */}
        <img
          className={styles.heroLogo}
          src="/figma/2_3100/9.svg"
          alt="Magic Coffee logo"
        />
        <div className={`${styles.brand} ${reenie.className}`}>
          Magic Coffee
        </div>
      </section>

      <section className={styles.body}>
        <h2 className={styles.heading}>Feel yourself like a barista!</h2>
        <p className={styles.subheading}>Magic coffee on order.</p>

        <div className={styles.dots} aria-label="Onboarding progress">
          <img src="/figma/2_3100/4.svg" alt="current" width={32} height={8} />
          <img src="/figma/2_3100/5.svg" alt="" width={8} height={8} />
          <img src="/figma/2_3100/6.svg" alt="" width={8} height={8} />
        </div>
      </section>

      <button className={styles.fab} aria-label="Next">
        <img src="/figma/2_3100/8.svg" alt="" width={32} height={32} />
      </button>
    </main>
  );
}