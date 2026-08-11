import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-lg font-semibold text-truffle">
            Fungal Mycoprotein DB
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
            <Link href="/admin" className="hover:text-berry">
              Admin
            </Link>
          </nav>
        </div>
        <p className="hidden font-sans text-xs text-muted sm:block">
          Alt-protein &amp; mycoprotein R&amp;D reference
        </p>
      </div>
    </header>
  );
}
