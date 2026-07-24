"use client";

import { useState, type ReactNode } from "react";
import { SectionHeading } from "@/components/ui/headings";

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
};

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  id,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={id} className="mb-6 border-b border-zinc-200 pb-6 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 text-left"
        aria-expanded={open}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-zinc-300 text-sm font-bold text-black"
          aria-hidden
        >
          {open ? "−" : "+"}
        </span>
        <SectionHeading className="!mb-0">{title}</SectionHeading>
      </button>
      {open && <div className="mt-4 pl-9">{children}</div>}
    </section>
  );
}
