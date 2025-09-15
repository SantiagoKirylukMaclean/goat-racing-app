"use client"
import { useEffect } from "react"

export default function ChunkRecovery() {
  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = String(e?.reason?.message || e?.reason || "")
      if (/ChunkLoadError|Loading chunk \d+ failed/i.test(msg)) {
        if (typeof window !== "undefined") window.location.reload()
      }
    }
    const onError = (e: ErrorEvent) => {
      const msg = String(e?.message || "")
      if (/ChunkLoadError|Loading chunk \d+ failed/i.test(msg)) {
        if (typeof window !== "undefined") window.location.reload()
      }
    }
    window.addEventListener("unhandledrejection", onRejection)
    window.addEventListener("error", onError)
    return () => {
      window.removeEventListener("unhandledrejection", onRejection)
      window.removeEventListener("error", onError)
    }
  }, [])
  return null
}

