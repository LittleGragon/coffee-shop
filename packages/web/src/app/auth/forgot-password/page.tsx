"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // UI only: submit action can be wired to /api/auth/forgot-password later.
  }

  return (
    <main className={styles.screen} aria-label="Forgot Password screen">
      <header className={styles.header}>
        <button
          type="button"
          aria-label="Go back"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          <img src="/figma/2_2880/4.svg" alt="" width={24} height={24} />
        </button>
      </header>

      <section className={styles.content}>
        <h1 className={styles.title}>Forgot Password?</h1>
        <p className={styles.subtitle}>Enter your email address</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.fieldRow}>
            <img
              className={styles.icon}
              src="/figma/2_2880/5.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className={styles.divider} aria-hidden="true" />
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              required
              aria-label="Email address"
            />
          </label>

          <button type="submit" className={styles.fab} aria-label="Send reset link">
            <img src="/figma/2_2880/10.svg" alt="" width={32} height={32} />
          </button>
        </form>
      </section>
    </main>
  );
}