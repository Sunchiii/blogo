"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const DISMISS_KEY = "pwa_install_dismissed";
const DISMISS_DURATION_DAYS = 7;

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void } | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if already dismissed recently
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = new Date(dismissed);
      const daysSince = (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DURATION_DAYS) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt: () => void });
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    setShow(false);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 rounded-lg border border-border bg-background shadow-lg p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-medium text-sm">Install Blogo Editor</p>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Install as an app to write posts offline.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleInstall} className="flex-1">
          Install
        </Button>
        <Button size="sm" variant="outline" onClick={handleDismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
