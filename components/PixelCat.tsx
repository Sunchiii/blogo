"use client";

import React, { useEffect, useState, useRef } from "react";

/**
 * A pixel-art style cat component that interacts with the cursor.
 */
export function PixelCat() {
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [isWinking, setIsWinking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      
      // Limit eye movement to 1 pixel in the 32x32 coordinate system
      const distance = Math.min(Math.hypot(dx, dy) / 50, 1);
      setEyePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    const handleAction = () => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 200);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleAction);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleAction);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-24 h-24 transition-transform hover:scale-110 duration-300 cursor-pointer group"
      title="Click me!"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full drop-shadow-md"
        shapeRendering="crispEdges"
      >
        {/* Tail */}
        <path d="M26 22h2v4h-2z" fill="currentColor" className="text-muted-foreground/40" />
        <path d="M24 20h2v2h-2z" fill="currentColor" className="text-muted-foreground/30 animate-bounce" />

        {/* Body */}
        <path d="M10 18h12v8H10z" fill="currentColor" className="text-foreground/90 dark:text-white/90" />
        <path d="M8 20h2v4H8z" fill="currentColor" className="text-foreground/90 dark:text-white/90" />
        <path d="M22 20h2v4h-2z" fill="currentColor" className="text-foreground/90 dark:text-white/90" />
        
        {/* Head */}
        <path d="M11 8h10v10H11z" fill="currentColor" className="text-foreground dark:text-white" />
        
        {/* Ears */}
        <path d="M11 6h2v2h-2z" fill="currentColor" className="text-foreground dark:text-white" />
        <path d="M19 6h2v2h-2z" fill="currentColor" className="text-foreground dark:text-white" />
        <path d="M12 7h1v1h-1z" fill="currentColor" className="text-rose-300/50 dark:text-rose-200/30" /> {/* Inner ear */}
        <path d="M20 7h1v1h-1z" fill="currentColor" className="text-rose-300/50 dark:text-rose-200/30" /> {/* Inner ear */}
        
        {/* Face Overlay (White/Lighter area) */}
        <path d="M13 14h6v2h-6z" fill="currentColor" className="text-background/20" />
        
        {/* Nose */}
        <path d="M15 14h2v1h-2z" fill="currentColor" className="text-rose-400" />

        {/* Eyes (Interactive) */}
        <g transform={`translate(${eyePos.x}, ${eyePos.y})`}>
          {isWinking ? (
            <>
              <path d="M13 11h2v1h-2z" fill="currentColor" className="text-amber-500/30 dark:text-amber-400/20" />
              <path d="M17 11h2v1h-2z" fill="currentColor" className="text-amber-500/30 dark:text-amber-400/20" />
            </>
          ) : (
            <>
              {/* Eye Glow Effect (Dark Mode only) */}
              <circle cx="14" cy="12" r="2" fill="currentColor" className="hidden dark:block text-amber-400/20 blur-[1px]" />
              <circle cx="18" cy="12" r="2" fill="currentColor" className="hidden dark:block text-amber-400/20 blur-[1px]" />
              
              {/* Main Eye Color */}
              <path d="M13 11h2v2h-2z" fill="currentColor" className="text-amber-500 dark:text-amber-400" />
              <path d="M17 11h2v2h-2z" fill="currentColor" className="text-amber-500 dark:text-amber-400" />
              
              {/* Slit Pupils (Classic Cat Look) */}
              <path d="M14 11h0.5v2h-0.5z" fill="black" className="opacity-80 dark:opacity-100" />
              <path d="M18 11h0.5v2h-0.5z" fill="black" className="opacity-80 dark:opacity-100" />
              
              {/* Eye Glint */}
              <path d="M13 11h0.5v0.5h-0.5z" fill="white" className="opacity-60" />
              <path d="M17 11h0.5v0.5h-0.5z" fill="white" className="opacity-60" />
            </>
          )}
        </g>

        {/* Whiskers */}
        <path d="M9 14h2v1H9z" fill="currentColor" className="text-muted-foreground/30" />
        <path d="M21 14h2v1h-2z" fill="currentColor" className="text-muted-foreground/30" />
      </svg>
      
      {/* Meow Bubble (appears on hover) */}
      <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold">
        MEOW!
      </div>
    </div>
  );
}
