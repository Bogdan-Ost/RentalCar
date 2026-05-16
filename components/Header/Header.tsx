"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./header.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Rental<span className={styles.logoAccent}>Car</span>
        </Link>

        {/* Навігаційне меню */}
        <nav className={styles.navigation}>
          <Link
            href="/"
            className={`${styles.navLink} ${pathname === "/" ? styles.activeLink : ""}`}
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className={`${styles.navLink} ${pathname.startsWith("/catalog") ? styles.activeLink : ""}`}
          >
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
