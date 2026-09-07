import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted text-cream">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-4 py-4 sm:px-10 md:px-14 lg:px-16 xl:px-20">
        <p className="font-sans text-sm">
          Built by Amrutha Girivasan ·{" "}
          <a
            href="https://github.com/amrugiri/fungal-db"
            className="underline decoration-cream/40 underline-offset-2 hover:text-gold"
          >
            Open source
          </a>
        </p>
        <Link href="/admin" className="font-sans text-sm hover:text-gold">
          Admin
        </Link>
      </div>
    </footer>
  );
}
