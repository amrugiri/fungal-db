import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted text-cream">
      <div className="mx-auto flex max-w-[96rem] items-center px-4 py-4 sm:px-10 md:px-14 lg:px-16 xl:px-20">
        <Link href="/admin" className="font-sans text-sm hover:text-gold">
          Admin
        </Link>
      </div>
    </footer>
  );
}
