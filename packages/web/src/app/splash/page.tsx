import styles from "./page.module.css";
import { Reenie_Beanie } from "next/font/google";

const reenie = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
});

export default function SplashPage() {
  return (
    <main className={`${styles.shell} ${styles.screen}`} aria-label="Splash">
      {/* Background photo */}
      <img
        className={styles.bg}
        src="/figma/2_2827/1.png"
        alt=""
        aria-hidden="true"
      />
      {/* Overlays to match Figma tone */}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.overlaySoft} aria-hidden="true" />

      {/* Centered logo and brand */}
      <section className={styles.content}>
        <img
          className={styles.logo}
          src="/figma/2_2827/5.svg"
          alt="Magic Coffee logo"
        />
        <div className={`${styles.brand} ${reenie.className}`}>Magic Coffee</div>
      </section>
    </main>
  );
}