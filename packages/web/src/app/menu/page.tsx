import styles from "./page.module.css";
import NameClient from "./NameClient";

type Item = { name: string; img: string };

const items: Item[] = [
  { name: "Americano", img: "/figma/2_2651/9.png" },
  { name: "Cappuccino", img: "/figma/2_2651/10.png" },
  { name: "Latte", img: "/figma/2_2651/13.png" },
  { name: "Flat White", img: "/figma/2_2651/14.png" },
  { name: "Raf", img: "/figma/2_2651/12.png" },
  { name: "Espresso", img: "/figma/2_2651/11.png" },
];

export default function MenuPage() {
  return (
    <main className={styles.screen} aria-label="Select your coffee">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.welcome}>Welcome!</div>
          <NameClient />
        </div>
        <div className={styles.actions}>
          <a href="#" aria-label="Cart">
            <img className={styles.icon} src="/figma/2_2651/1.svg" alt="" aria-hidden="true" />
          </a>
          <a href="#" aria-label="Profile">
            <img className={styles.icon} src="/figma/2_2651/8.svg" alt="" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* Dark panel with grid */}
      <section className={styles.panel}>
        <div className={styles.sectionTitle}>Select your coffee</div>

        <div className={styles.grid}>
          {items.map((it) => (
            <a
              key={it.name}
              href={`/customize?name=${encodeURIComponent(it.name)}&image=${encodeURIComponent(it.img)}&price=9&category=Coffee`}
              className={styles.card}
              aria-label={`Customize ${it.name}`}
            >
              <img className={styles.cardImg} src={it.img} alt="" aria-hidden="true" />
              <div className={styles.cardTitle}>{it.name}</div>
            </a>
          ))}
        </div>

        {/* Bottom nav */}
        <div className={styles.navWrap}>
          <nav className={styles.navBar} aria-label="Bottom navigation">
            <a href="/menu" aria-current="page">
              <img className={styles.navIconActive} src="/figma/2_2651/5.svg" alt="Menu" />
            </a>
            <a href="/rewards">
              <img className={styles.navIcon} src="/figma/2_2651/6.svg" alt="Gifts" />
            </a>
            <a href="/orders">
              <img className={styles.navIcon} src="/figma/2_2651/7.svg" alt="Orders" />
            </a>
          </nav>
        </div>
      </section>
    </main>
  );
}