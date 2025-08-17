"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Hook up to /api/auth/login if needed. For now, UI only.
  }

  return (
    <main className={styles.screen} aria-label="Sign in screen">
      <header className={styles.header}>
        <button
          type="button"
          aria-label="Go back"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          <img src="/figma/2_3041/5.svg" alt="" width={24} height={24} />
        </button>
      </header>

      <section className={styles.content}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>Welcome back</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email */}
          <label className={styles.fieldRow}>
            <img
              className={styles.icon}
              src="/figma/2_3041/7.svg"
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
            {/* spacer for layout symmetry */}
            <span style={{ width: 24 }} aria-hidden="true" />
          </label>

          {/* Password */}
          <label className={styles.fieldRow}>
            <img
              className={styles.icon}
              src="/figma/2_3041/14.svg"
              alt=""
              width={16}
              height={19}
              aria-hidden="true"
            />
            <span className={styles.divider} aria-hidden="true" />
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              aria-label="Password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={styles.iconBtn}
              onClick={() => setShowPassword((v) => !v)}
            >
              <img
                src="/figma/2_3041/15.svg"
                alt=""
                width={18}
                height={15}
                aria-hidden="true"
              />
            </button>
          </label>

          <div className={styles.forgot}>
            <Link href="/auth/forgot-password">Forgot Password?</Link>
          </div>

          {/* Submit floating action button */}
          <button type="submit" className={styles.fab} aria-label="Sign in">
            <img src="/figma/2_3041/6.svg" alt="" width={32} height={32} />
          </button>
        </form>
      </section>

      <div className={styles.bottomNote}>
        New member? <Link href="/auth/sign-up">Sign up</Link>
      </div>
    </main>
  );
}