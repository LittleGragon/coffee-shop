"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wire to /api/auth/register if needed. UI only per design task.
  }

  return (
    <main className={styles.screen} aria-label="Sign up screen">
      <header className={styles.header}>
        <button
          type="button"
          aria-label="Go back"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          <img src="/figma/2_2917/5.svg" alt="" width={24} height={24} />
        </button>
      </header>

      <section className={styles.content}>
        <h1 className={styles.title}>Sign up</h1>
        <p className={styles.subtitle}>Create an account here</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name */}
          <label className={styles.fieldRow}>
            <img
              className={styles.icon}
              src="/figma/2_2917/24.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className={styles.divider} aria-hidden="true" />
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Create an account here"
              autoComplete="name"
              required
              aria-label="Name"
            />
            <span style={{ width: 24 }} aria-hidden="true" />
          </label>

          {/* Mobile number */}
          <label className={styles.fieldRow}>
            <img
              className={styles.icon}
              src="/figma/2_2917/26.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className={styles.divider} aria-hidden="true" />
            <input
              className={styles.input}
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              autoComplete="tel"
              aria-label="Mobile Number"
            />
            <span style={{ width: 24 }} aria-hidden="true" />
          </label>

          {/* Email */}
          <label className={styles.fieldRow}>
            <img
              className={styles.icon}
              src="/figma/2_2917/10.svg"
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
            <span style={{ width: 24 }} aria-hidden="true" />
          </label>

          {/* Password */}
          <label className={styles.fieldRow}>
            <img
              className={styles.icon}
              src="/figma/2_2917/20.svg"
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
              autoComplete="new-password"
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
                src="/figma/2_2917/21.svg"
                alt=""
                width={18}
                height={15}
                aria-hidden="true"
              />
            </button>
          </label>

          <p className={styles.terms}>
            By signing up you agree with our{" "}
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>
              Terms of Use
            </a>
          </p>

          {/* Submit floating action button */}
          <button type="submit" className={styles.fab} aria-label="Create account">
            <img src="/figma/2_2917/6.svg" alt="" width={32} height={32} />
          </button>
        </form>
      </section>

      <div className={styles.bottomNote}>
        Already a member? <Link href="/auth/sign-in">Sign in</Link>
      </div>
    </main>
  );
}