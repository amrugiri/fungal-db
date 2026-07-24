"use client";

import { useState, type ReactNode } from "react";
import { SubHeading } from "@/components/ui/headings";

type CollapsibleSubSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function CollapsibleSubSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSubSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-5 border-t border-zinc-100 pt-4 first:mt-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={open}
      >
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-zinc-300 text-xs font-bold text-black"
          aria-hidden
        >
          {open ? "−" : "+"}
        </span>
        <SubHeading className="!mb-0">{title}</SubHeading>
      </button>
      {open && <div className="mt-3 pl-7">{children}</div>}
    </div>
  );
}
