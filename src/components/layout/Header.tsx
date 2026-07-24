import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-black">
            Fungal Mycoprotein DB
          </Link>
          <nav className="flex gap-4 text-sm text-black">
            <Link href="/" className="hover:underline">
              Species
            </Link>
            <Link href="/compare" className="hover:underline">
              Compare
            </Link>
            <Link href="/disclaimer" className="hover:underline">
              Disclaimer
            </Link>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </nav>
        </div>
        <p className="hidden text-xs text-black sm:block">
          Alt-protein &amp; mycoprotein R&amp;D reference
        </p>
      </div>
    </header>
  );
}
