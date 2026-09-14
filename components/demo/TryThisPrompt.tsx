"use client";

import { useEffect, useState } from "react";
import styles from "./demo.module.css";

/**
 * The actual prompt an attendee would paste into a fresh agent session to
 * produce this page. Copy uses the async clipboard API, which needs a secure
 * context, so it falls back to selecting the text when that is unavailable.
 */
export default function TryThisPrompt({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      // No clipboard permission (or an insecure context): select the block so
      // the reader can copy it by hand rather than get nothing at all.
      const block = document.getElementById(`prompt-${hash(prompt)}`);
      if (block) {
        const range = document.createRange();
        range.selectNodeContents(block);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }

  return (
    <div>
      <div className={styles.promptHead}>
        <p className={styles.promptNote}>
          Paste this into a fresh agent session to build this page.
        </p>
        <button
          type="button"
          className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
          onClick={copy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={styles.promptBlock} id={`prompt-${hash(prompt)}`}>
        {prompt}
      </pre>
    </div>
  );
}

/** Stable id per prompt so two blocks on one page never collide. */
function hash(value: string): string {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}
