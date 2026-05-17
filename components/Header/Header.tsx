"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./header.module.css";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo className={styles.logo} />

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
