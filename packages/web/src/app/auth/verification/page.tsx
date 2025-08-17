"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function VerificationPage() {
  const router = useRouter();
  const [values, setValues] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function focusIndex(i: number) {
    const el = inputsRef.current[i];
    if (el) el.focus();
  }

  function handleChange(i: number, v: string) {
    const digit = v.replace(/\D/g, "").slice(-1) || "";
    setValues((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < inputsRef.current.length - 1) {
      focusIndex(i + 1);
    }
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      focusIndex(i - 1);
    }
    if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      focusIndex(i - 1);
    }
    if (e.key === "ArrowRight" && i < inputsRef.current.length - 1) {
      e.preventDefault();
      focusIndex(i + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!text) return;
    const arr = text.split("");
    setValues((prev) => {
      const next = [...prev];
      for (let i = 0; i < 4; i++) next[i] = arr[i] || "";
      return next;
    });
    const lastIdx = Math.min(arr.length, 3);
    focusIndex(lastIdx);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = values.join("");
    if (code.length < 4) return;
    // Wire to verification API if needed
  }

  function formatSec(s: number) {
    const mm = "00";
    const ss = String(s).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  return (
    <main className={styles.screen} aria-label="Verification screen">
      <header className={styles.header}>
        <button
          type="button"
          aria-label="Go back"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          <img src="/figma/2_2851/5.svg" alt="" width={24} height={24} />
        </button>
      </header>

      <section className={styles.content}>
        <h1 className={styles.title}>Verification</h1>
        <p className={styles.subtitle}>Enter the OTP code we sent you</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.otp} onPaste={handlePaste}>
            {values.map((val, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                className={styles.otpInput}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                aria-label={`Digit ${i + 1}`}
                value={val}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                maxLength={1}
              />
            ))}
          </div>

          <p className={styles.resend} aria-live="polite">
            Resend in {formatSec(seconds)}
          </p>

          <button
            type="submit"
            className={styles.fab}
            aria-label="Verify"
            disabled={values.join("").length < 4}
            title={values.join("").length < 4 ? "Enter 4-digit code" : "Verify"}
          >
            <img src="/figma/2_2851/6.svg" alt="" width={32} height={32} />
          </button>
        </form>
      </section>
    </main>
  );
}