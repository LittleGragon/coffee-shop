"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import { apiPost } from "@/lib/api-client";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const data = new FormData(form);
      const email = String(data.get("email") || "");
      const password = String(data.get("password") || "");
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const res = await apiPost<{ success: boolean; user: any; token: string }>(
        "/api/auth/login",
        { email, password }
      );

      if (!res?.token) {
        throw new Error("Invalid response from server");
      }

      // Persist token (and optionally user)
      localStorage.setItem("token", res.token);
      try {
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch {}

      // Navigate after successful sign-in
      router.replace("/profile");
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
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
          <p className={styles.caption}>Email address</p>
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
          <p className={styles.caption}>Password</p>
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
          <div className={styles.alertRow} aria-live="polite">
            {error ? (
              <p role="alert" className={styles.alertText}>
                {error}
              </p>
            ) : null}
          </div>

          {/* Submit floating action button */}
          <button
            type="submit"
            className={styles.fab}
            aria-label="Sign in"
            disabled={loading}
            aria-disabled={loading}
            aria-busy={loading}
          >
            <img className={styles.fabBase} src="/figma/2_3041/4.svg" alt="" width={56} height={56} />
            <img className={styles.fabArrow} src="/figma/2_3041/6.svg" alt="" width={18} height={18} />
          </button>
        </form>
      </section>

      <div className={styles.bottomNote}>
        New member? <Link href="/auth/sign-up">Sign up</Link>
      </div>
    </main>
  );
}