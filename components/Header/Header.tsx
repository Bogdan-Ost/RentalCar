import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/">
        <svg
          width="134"
          height="24"
          viewBox="0 0 134 24"
          fill="none"
          xmlns="w3.org"
        >
          <path d="M10 4H2V20H10V18H4V13H9V11H4V6H10V4Z" fill="#3470FF" />
          <path d="M15 8V20H17V8H15Z" fill="#121417" />
        </svg>
      </Link>

      <nav>
        <Link href="/">Home</Link>
        <Link href="/catalog">Catalog</Link>
      </nav>
    </header>
  );
}
