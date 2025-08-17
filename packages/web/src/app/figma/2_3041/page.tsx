'use client';

import React from 'react';

export default function SignInFigma_2_3041() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <main className="figma-2_3041">
      <div className="device">
        {/* Status bar */}
        <div className="status">
          <div className="time">9:41</div>
          <div className="indicators" aria-hidden="true">
            <img src="/figma/2_3041/1.svg" alt="" />
            <img src="/figma/2_3041/2.svg" alt="" />
            <img src="/figma/2_3041/3.svg" alt="" />
          </div>
        </div>

        {/* Back icon (from canvas at top-left) */}
        <button className="back" aria-label="Go back" type="button" onClick={() => window.history.back()}>
          <img src="/figma/2_3041/5.svg" alt="" />
        </button>

        {/* Title and subtitle */}
        <h1 className="title">Sign in</h1>
        <p className="subtitle">Welcome back</p>

        {/* Form */}
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          {/* Email field */}
          <div className="field">
            <label htmlFor="email">Email address</label>
            <div className="inputWrap">
              <span className="leftIcon" aria-hidden="true">
                <img src="/figma/2_3041/7.svg" alt="" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="inputWrap">
              <span className="leftIcon" aria-hidden="true">
                <img src="/figma/2_3041/14.svg" alt="" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="rightIcon"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                <img src="/figma/2_3041/15.svg" alt="" />
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="actions">
            <a className="link" href="/auth/forgot-password">Forgot Password?</a>
          </div>

          {/* Floating Action Button (CTA), mapped from 4.svg/6.svg arrow button in canvas */}
          <div className="fab">
            <button className="fabBtn" type="submit" aria-label="Sign in">
              <img className="fabBase" src="/figma/2_3041/4.svg" alt="" />
              <img className="fabArrow" src="/figma/2_3041/6.svg" alt="" />
            </button>
          </div>
        </form>

        {/* Bottom helper text */}
        <p className="bottomText">
          <span>New member? </span>
          <a className="link" href="/auth/sign-up">Sign up</a>
        </p>
      </div>

      <style jsx>{`
        :root {
          --bg: #ffffff;
          --ink: #181D2D;
          --muted: #AAAAAA;
          --brand: #324A59;
          --border: #E2E8F0;
          --radius: 14px;
          --field-h: 48px;
          --shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
        }
        .figma-2_3041 {
          min-height: 100dvh;
          background: var(--bg);
          display: grid;
          place-items: center;
          padding: 24px 16px;
        }
        .device {
          position: relative;
          width: min(100%, 420px);
          min-width: 320px;
          aspect-ratio: 375 / 812;
          max-height: calc(100dvh - 48px);
          border-radius: clamp(16px, 2vw, 24px);
          box-shadow: var(--shadow);
          border: 1px solid #f3f4f6;
          background: #fff;
          overflow: hidden;
          padding: 0 16px;
        }

        /* Status bar */
        .status {
          position: absolute;
          left: 16px;
          right: 16px;
          top: 12px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }
        .time {
          font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-weight: 500;
          font-size: clamp(12px, 3.8vw, 15px);
          color: var(--ink);
        }
        .indicators {
          display: inline-flex;
          gap: 8px;
        }
        .indicators img {
          display: block;
          height: 12px;
          width: auto;
          object-fit: contain;
        }

        .back {
          position: absolute;
          top: 52px;
          left: 10px;
          background: transparent;
          border: 0;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
        }
        .back img {
          height: 24px;
          width: 24px;
        }

        .title {
          position: absolute;
          top: 120px;
          left: 41px;
          margin: 0;
          font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-size: clamp(20px, 5.6vw, 22px);
          font-weight: 500;
          color: var(--ink);
        }
        .subtitle {
          position: absolute;
          top: 170px;
          left: 41px;
          margin: 0;
          font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-size: clamp(13px, 4.2vw, 14px);
          color: var(--muted);
        }

        .form {
          position: absolute;
          left: 41px;
          right: 41px;
          top: 244px;
          display: grid;
          gap: 18px;
        }
        .field label {
          display: block;
          font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-size: clamp(11px, 3.6vw, 12px);
          color: #C1C7D0;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .inputWrap {
          display: grid;
          grid-template-columns: 36px 1fr 36px;
          align-items: center;
          height: var(--field-h);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 0 8px;
          background: #fff;
        }
        .inputWrap input {
          border: 0;
          outline: 0;
          height: 100%;
          font-size: clamp(14px, 4.4vw, 15px);
          font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color: var(--ink);
        }
        .inputWrap input::placeholder {
          color: #cbd5e1;
        }
        .leftIcon {
          display: inline-grid;
          place-items: center;
          height: 100%;
        }
        .leftIcon img {
          width: 18px;
          height: 18px;
        }
        .rightIcon {
          display: inline-grid;
          place-items: center;
          height: 100%;
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          border-radius: 10px;
        }
        .rightIcon img {
          width: 18px;
          height: 18px;
        }

        .actions {
          margin-top: 4px;
          display: flex;
          justify-content: center;
        }
        .link {
          color: var(--brand);
          font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-size: clamp(13px, 4.2vw, 14px);
          font-weight: 500;
          text-decoration: none;
        }

        .fab {
          position: absolute;
          right: 24px;
          top: 512px;
        }
        .fabBtn {
          display: inline-grid;
          place-items: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 0;
          background: transparent;
          cursor: pointer;
          position: relative;
        }
        .fabBase {
          width: 56px;
          height: 56px;
          display: block;
        }
        .fabArrow {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 18px;
          height: 18px;
        }

        .bottomText {
          position: absolute;
          left: 41px;
          bottom: 48px;
          margin: 0;
          font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-size: clamp(13px, 4.2vw, 14px);
          color: var(--muted);
        }
        .bottomText .link {
          margin-left: 4px;
        }

        /* Responsive adjustments */
        @media (max-width: 420px) {
          .device {
            width: 100%;
            aspect-ratio: unset;
            height: calc(100dvh - 48px);
            border-radius: 0;
            box-shadow: none;
            border: 0;
          }
        }
      `}</style>
    </main>
  );
}