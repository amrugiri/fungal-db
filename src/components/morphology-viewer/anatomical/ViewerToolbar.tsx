"use client";

import type { ReactNode } from "react";

export type InteractionMode = "rotate" | "zoom";

export const VIEW_PRESETS = [
  { id: "front", rotation: 0 },
  { id: "side", rotation: 90 },
  { id: "back", rotation: 180 },
  { id: "top", rotation: 0 },
  { id: "gills", rotation: 0 },
  { id: "low", rotation: 45 },
] as const;

export function ToolbarIcon({
  label,
  active,
  onClick,
  children,
  light = false,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition ${
        active
          ? light
            ? "text-emerald-600"
            : "text-emerald-400"
          : light
            ? "text-zinc-500 hover:text-black"
            : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
      <span
        className={
          active
            ? light
              ? "border-b-2 border-emerald-600 pb-0.5"
              : "border-b-2 border-emerald-400 pb-0.5"
            : ""
        }
      >
        {label}
      </span>
    </button>
  );
}

export function ViewThumbnail({
  active,
  rotation,
  onClick,
  light = false,
}: {
  active: boolean;
  rotation: number;
  onClick: () => void;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-md border transition ${
        light ? "bg-white" : "bg-zinc-900"
      } ${
        active
          ? "border-emerald-500 ring-1 ring-emerald-500/50"
          : light
            ? "border-zinc-300 hover:border-zinc-500"
            : "border-zinc-700 hover:border-zinc-500"
      }`}
      aria-label="Change camera view"
    >
      <svg
        viewBox="0 0 32 32"
        className={`h-7 w-7 ${light ? "text-zinc-700" : "text-zinc-300"}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <ellipse cx="16" cy="11" rx="9" ry="5" fill="currentColor" opacity="0.9" />
        <rect x="14" y="14" width="4" height="12" rx="1.5" fill="currentColor" opacity="0.85" />
        <ellipse cx="16" cy="27" rx="5" ry="2" fill="#6b5344" opacity="0.7" />
      </svg>
    </button>
  );
}

export function RotateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12a8 8 0 0 1 13.5-5.7M20 7V3m0 0h-4m4 0-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12a8 8 0 0 1-13.5 5.7M4 17v4m0 0h4M4 21l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" strokeLinecap="round" />
      <path d="M11 8v6M8 11h6" strokeLinecap="round" />
    </svg>
  );
}

export function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12a8 8 0 0 1 14-5.5" strokeLinecap="round" />
      <path d="M18 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" strokeLinecap="round" />
    </svg>
  );
}

export function CrossSectionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" strokeLinecap="round" />
      <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" fillOpacity="0.25" stroke="none" />
    </svg>
  );
}
