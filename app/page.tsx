import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className="w-full">
      <section className={styles.heroSection}>
        <Image
          src="/hero-bg.webp"
          alt="Find your perfect rental car background"
          fill
          priority
          quality={85}
          className={styles.heroImage}
        />

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find your perfect rental car</h1>
          <p className={styles.heroSubtitle}>
            Reliable and budget-friendly rentals for any journey
          </p>

          <Link href="/catalog" className="mt-8">
            <button type="button" className={styles.heroButton}>
              View Catalog
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
