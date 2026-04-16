"use client";

import React from "react";
import { PixelCat } from "./PixelCat";

/**
 * A horizontal 8-bit styled panel that houses the interactive PixelCat.
 */
export function PixelPanel() {
  return (
    <div className="w-full py-6 px-4 bg-muted/20 border-2 border-border border-dashed rounded-lg overflow-hidden relative group">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-sans uppercase tracking-widest mb-2 border border-primary/20">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            System Status: Purring
          </div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-tight">Cat-alyzer Log</h3>
          <p className="text-xs text-muted-foreground font-sans max-w-sm">
            Tracking cursor movement... 100% precision. 
            Petting highly recommended.
          </p>
        </div>

        {/* The Interactive Pixel Cat */}
        <div className="flex-shrink-0">
          <PixelCat />
        </div>

        <div className="hidden lg:flex flex-col items-end gap-2 font-sans text-[10px] text-muted-foreground/50">
          <span>CAT_X: 128.0</span>
          <span>CAT_Y: 064.2</span>
          <span>MODE: EYE_FOLLOW</span>
        </div>
      </div>

      {/* Retro "Scanline" effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent bg-[length:100%_4px]" />
    </div>
  );
}
