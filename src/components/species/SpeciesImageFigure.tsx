import { SectionHeading, SubHeading, labelClass } from "@/components/ui/headings";

type SpeciesImageProps = {
  url: string;
  alt: string;
  caption: string;
  compact?: boolean;
  /** Between sidebar thumbnail and full-width figure */
  medium?: boolean;
};

export function SpeciesImageFigure({
  url,
  alt,
  caption,
  compact = false,
  medium = false,
}: SpeciesImageProps) {
  const isCompact = compact && !medium;
  const isMedium = medium;

  return (
    <figure
      className={`rounded-lg border border-zinc-200 bg-white ${
        isMedium ? "w-[11rem] shrink-0 p-2" : isCompact ? "p-1.5" : "p-3"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded bg-zinc-100 ${
          isMedium ? "aspect-square" : isCompact ? "aspect-square" : "aspect-video"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          className="h-full w-full object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <figcaption
        className={`mt-1.5 text-black ${
          isMedium ? "text-[11px] leading-snug" : isCompact ? "text-[10px] leading-snug" : "text-sm"
        }`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

export { SectionHeading, SubHeading, labelClass };
