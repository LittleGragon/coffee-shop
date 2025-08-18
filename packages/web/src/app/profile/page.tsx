"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api-client";

type MeResponse = {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    created_at: string;
  };
};

export default function ProfilePage() {
  const [name, setName] = useState<string>("User");
  const [email, setEmail] = useState<string>("user@example.com");
  // phone and store address are static in current design; can be wired later
  const phone = "+375 33 664–57–36";
  const storeAddress = "Bradford BD1 1PR";

  useEffect(() => {
    let mounted = true;

    // Prefill from localStorage to avoid hydration mismatch
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (mounted) {
        setName(u?.name || "User");
        setEmail(u?.email || "user@example.com");
      }
    } catch {
      // ignore
    }

    (async () => {
      try {
        const res = await apiGet<MeResponse>("/api/auth/me");
        if (mounted && res?.success && res?.user) {
          setName(res.user.name || "User");
          setEmail(res.user.email || "user@example.com");
        }
      } catch {
        // ignore; leave defaults for unauthenticated users
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="screen" aria-label="Profile">
      {/* Header */}
      <header className="header">
        <a href="/menu" className="back" aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="#001833"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <h1 className="title">Profile</h1>
        <span />
      </header>

      {/* Content */}
      <section className="content">
        <ul className="list" role="list">
          {/* Name */}
          <li className="row">
            <span className="leadIcon">
              <img
                src="/figma/2_1550/4.svg"
                alt=""
                aria-hidden="true"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </span>
            <span className="meta">
              <span className="label">Name</span>
              <span className="value strong" suppressHydrationWarning>{name}</span>
            </span>
            <button
              className="edit"
              aria-label="Edit name"
              title="Edit"
              type="button"
            >
              <img src="/figma/2_1550/5.svg" alt="" aria-hidden="true" />
            </button>
          </li>

          {/* Phone */}
          <li className="row">
            <span className="leadIcon">
              <img
                src="/figma/2_1550/5.svg"
                alt=""
                aria-hidden="true"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </span>
            <span className="meta">
              <span className="label">Phone number</span>
              <span className="value strong">{phone}</span>
            </span>
            <button className="edit" aria-label="Edit phone" title="Edit" type="button">
              <img src="/figma/2_1550/7.svg" alt="" aria-hidden="true" />
            </button>
          </li>

          {/* Email */}
          <li className="row">
            <span className="leadIcon">
              <img
                src="/figma/2_1550/6.svg"
                alt=""
                aria-hidden="true"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </span>
            <span className="meta">
              <span className="label">Email</span>
              <span className="value strong" suppressHydrationWarning>{email}</span>
            </span>
            <button className="edit" aria-label="Edit email" title="Edit" type="button">
              <img src="/figma/2_1550/9.svg" alt="" aria-hidden="true" />
            </button>
          </li>

          {/* Store address */}
          <li className="row">
            <span className="leadIcon">
              <img
                src="/figma/2_1550/7.svg"
                alt=""
                aria-hidden="true"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
              />
            </span>
            <span className="meta">
              <span className="label">Magic Coffee store address</span>
              <span className="value strong">{storeAddress}</span>
            </span>
            <button className="edit" aria-label="Edit store address" title="Edit" type="button">
              <img src="/figma/2_1550/11.svg" alt="" aria-hidden="true" />
            </button>
          </li>
        </ul>

        {/* QR code */}
        <div className="qrBlock" aria-label="Personal QR code">
          <div className="qrLayer">
            <img src="/figma/2_1550/16.svg" alt="" aria-hidden="true" className="qrBase" />
            <img src="/figma/2_1550/17.svg" alt="Your personal QR code" className="qrTop" />
          </div>
        </div>
      </section>

      <style jsx>{`
        .screen {
          min-height: 100svh;
          background: #ffffff;
          padding: clamp(10px, 4vw, 16px);
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 8px;
        }
        .header {
          display: grid;
          grid-template-columns: 24px 1fr 24px;
          align-items: center;
        }
        .title {
          margin: 0;
          text-align: center;
          color: #001833;
          font-weight: 600;
          font-size: 18px;
          letter-spacing: 0.2px;
        }

        .content {
          display: grid;
          gap: 18px;
        }
        .list {
          display: grid;
          gap: 12px;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .row {
          display: grid;
          grid-template-columns: 44px 1fr 28px;
          align-items: center;
          gap: 12px;
        }
        .leadIcon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f1f5f9;
          display: grid;
          place-items: center;
        }
        .leadIcon img {
          width: 22px;
          height: 22px;
          object-fit: contain;
        }
        .meta {
          display: grid;
          gap: 2px;
        }
        .label {
          color: rgba(0, 24, 51, 0.22);
          font-size: 12px;
          font-weight: 600;
        }
        .value {
          color: #001833;
          font-size: 14px;
          line-height: 1.3;
        }
        .strong {
          font-weight: 600;
        }
        .value.strong {
          color: #324A59;
        }
        .edit {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          border-radius: 8px;
          display: inline-grid;
          place-items: center;
          cursor: pointer;
        }
        .edit:hover {
          background: rgba(50, 74, 89, 0.06);
        }
        .edit img {
          width: 16px;
          height: 16px;
          object-fit: contain;
          opacity: 0.85;
        }

        .qrBlock {
          margin-top: clamp(8px, 6vh, 24px);
          display: grid;
          place-items: center;
        }
        .qrLayer {
          position: relative;
          width: clamp(220px, 70vw, 300px);
        }
        .qrBase,
        .qrTop {
          display: block;
          width: 100%;
          height: auto;
        }
        .qrTop {
          position: absolute;
          inset: 0;
        }

        @media (min-width: 768px) {
          .screen {
            grid-template-columns: 1fr minmax(360px, 480px) 1fr;
          }
          .header,
          .content {
            grid-column: 2;
          }
        }
      `}</style>
    </main>
  );
}