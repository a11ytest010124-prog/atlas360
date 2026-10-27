import { useEffect, useRef, useState } from "react"
import "./RunStatusModal.css"

type RunStatusModalProps = {
  open: boolean
  suite: string
  requestNumber: string
  onClose: () => void
}

export default function RunStatusModal({
  open,
  suite,
  requestNumber,
  onClose,
}: RunStatusModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "Tab") {
        const controls = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        )
        if (!controls.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = oldOverflow
      previousFocus?.focus()
    }
  }, [open, onClose])

  useEffect(() => {
    setCopied(false)
  }, [requestNumber, open])

  if (!open) return null

  const copyRequest = async () => {
    try {
      await navigator.clipboard.writeText(requestNumber)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className="rs-overlay open"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="rs-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rs-title"
        aria-describedby="rs-msg"
        tabIndex={-1}
      >
        <div className="rs-head">
          <h2 id="rs-title">Request submitted</h2>
          <button
            ref={closeRef}
            type="button"
            className="rs-close"
            aria-label="Close run status dialog"
            onClick={onClose}
          >
            ×
          </button>
          <div className="rs-lane" aria-hidden="true">
            <div className="rs-track" />
            <div className="rs-start" />
            <div className="rs-flag" />
            <div className="rs-finish" />
            <div className="rs-wait">
              <i />
              <i />
              <i />
            </div>
            <div className="rs-runner">
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <g className="gear">
                  <path
                    d="M34.03 17.78 L37.92 18.31 L37.92 21.69 L34.03 22.22 L31.49 28.35 L33.87 31.47 L31.47 33.87 L28.35 31.49 L22.22 34.03 L21.69 37.92 L18.31 37.92 L17.78 34.03 L11.65 31.49 L8.53 33.87 L6.13 31.47 L8.51 28.35 L5.97 22.22 L2.08 21.69 L2.08 18.31 L5.97 17.78 L8.51 11.65 L6.13 8.53 L8.53 6.13 L11.65 8.51 L17.78 5.97 L18.31 2.08 L21.69 2.08 L22.22 5.97 L28.35 8.51 L31.47 6.13 L33.87 8.53 L31.49 11.65 Z"
                    fill="#00539B"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="20" r="9" fill="#fff" />
                  <path
                    d="M17.6 15.6 L25 20 L17.6 24.4 Z"
                    fill="#00539B"
                    stroke="#00539B"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="rs-body">
          <span className="rs-status">
            <i aria-hidden="true" />
            In progress
          </span>
          <p className="rs-msg" id="rs-msg">
            Your <strong>{suite}</strong> regression suite execution is in
            progress and we will email the details once the run is completed.
            Thank you.
          </p>
          <div className="rs-req">
            <div>
              <small>Request number</small>
              <b>{requestNumber || "—"}</b>
            </div>
            <button
              type="button"
              className="rs-copy"
              onClick={copyRequest}
              disabled={!requestNumber}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="rs-footer">
            <span className="rs-thanks">You can safely close this window.</span>
            <button type="button" className="rs-btn" onClick={onClose}>
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
