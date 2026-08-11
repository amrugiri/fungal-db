import type { ReactNode } from "react";

const sectionClass = "mb-4 font-sans text-xl font-bold text-truffle";
const subSectionClass = "mb-2 font-sans text-base font-bold text-truffle";

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

export const labelClass = "font-sans text-base font-bold text-truffle";
