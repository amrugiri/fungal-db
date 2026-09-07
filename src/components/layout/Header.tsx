import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between px-4 py-4 sm:px-10 md:px-14 lg:px-16 xl:px-20">
        <Link href="/" className="font-display text-3xl font-semibold italic text-truffle">
          MycoProt
        </Link>
        <nav className="flex gap-4 font-sans text-sm text-truffle">
          <Link href="/" className="hover:text-berry">
            Species
          </Link>
          <Link href="/compare" className="hover:text-berry">
            Compare
          </Link>
          <Link href="/disclaimer" className="hover:text-berry">
            Disclaimer
          </Link>
        </nav>
      </div>
    </header>
  );
}
