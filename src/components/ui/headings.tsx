import type { ReactNode } from "react";

const sectionClass = "mb-4 text-xl font-bold text-black";
const subSectionClass = "mb-2 text-base font-bold text-black";

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={`${sectionClass} ${className}`.trim()}>{children}</h2>;
}

export function SubHeading({
  children,
  className = "",
  as: Tag = "h3",
}: {
  children: ReactNode;
  className?: string;
  as?: "h3" | "h4" | "dt";
}) {
  return <Tag className={`${subSectionClass} ${className}`.trim()}>{children}</Tag>;
}

export const labelClass = "text-base font-bold text-black";
