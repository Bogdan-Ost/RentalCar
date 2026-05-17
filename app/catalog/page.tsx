"use client";

import React, { useState, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Select from "react-select";

import styles from "./catalog.module.css";
import { getCars } from "@/lib/api/clientApi";
import { getCustomSelectStyles } from "@/types/selectStyles";

import { getFilterMetadata } from "@/lib/api/clientApi";

const fallbackBrands = [
  "Buick",
  "Volvo",
  "HUMMER",
  "Subaru",
  "Mitsubishi",
  "Nissan",
  "Lincoln",
];

const priceOptions = Array.from({ length: 13 }, (_, i) => {
  const value = String((i + 3) * 10);
  return { value, label: value };
});

export default function CatalogPage() {
  const { data: filterMetadata } = useQuery({
    queryKey: ["filterMetadata"],
    queryFn: async () => {
      try {
        return await getFilterMetadata();
      } catch (error) {
        console.warn(
          "Ендпоінт /cars/filters повернув помилку. Використовуємо fallback.",
        );
        return { brands: fallbackBrands };
      }
    },
    staleTime: Infinity,
  });

  const brandOptions = useMemo(() => {
    const brandsList = filterMetadata?.brands || fallbackBrands;
    return brandsList.map((brand) => ({ value: brand, label: brand }));
  }, [filterMetadata]);

  const [selectedBrand, setSelectedBrand] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [inputMinMileage, setInputMinMileage] = useState<string>("");
  const [inputMaxMileage, setInputMaxMileage] = useState<string>("");

  const [queryBrand, setQueryBrand] = useState<string>("");
  const [queryPrice, setQueryPrice] = useState<string>("");
  const [queryMinMileage, setQueryMinMileage] = useState<number | undefined>(
    undefined,
  );
  const [queryMaxMileage, setQueryMaxMileage] = useState<number | undefined>(
    undefined,
  );

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("car_favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleFavorite = (carId: string) => {
    const updatedFavorites = favorites.includes(carId)
      ? favorites.filter((id) => id !== carId)
      : [...favorites, carId];

    setFavorites(updatedFavorites);
    localStorage.setItem("car_favorites", JSON.stringify(updatedFavorites));
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      "cars",
      queryBrand,
      queryPrice,
      queryMinMileage,
      queryMaxMileage,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getCars(pageParam, {
        brand: queryBrand || undefined,
        rentalPrice: queryPrice || undefined,
        minMileage: queryMinMileage,
        maxMileage: queryMaxMileage,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
  });

  const cars = data?.pages.flatMap((page) => page.cars) || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryBrand(selectedBrand?.value || "");
    setQueryPrice(selectedPrice?.value || "");
    setQueryMinMileage(inputMinMileage ? Number(inputMinMileage) : undefined);
    setQueryMaxMileage(inputMaxMileage ? Number(inputMaxMileage) : undefined);
  };

  return (
    <div className={styles.catalog}>
      <form onSubmit={handleSearchSubmit} className={styles.filterForm}>
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Car brand</label>
          <Select
            instanceId="brand-select"
            options={brandOptions}
            value={selectedBrand}
            onChange={(option) => setSelectedBrand(option)}
            placeholder="Choose a brand"
            styles={getCustomSelectStyles("224px")}
            isSearchable={true}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.label}>Price / 1 hour</label>
          <Select
            instanceId="price-select"
            options={priceOptions}
            value={selectedPrice}
            onChange={(option) => setSelectedPrice(option)}
            placeholder="To $"
            styles={getCustomSelectStyles("125px")}
            isSearchable={false}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.label}>Ccars mileage / km</label>
          <div className={styles.mileageInputs}>
            <input
              type="number"
              value={inputMinMileage}
              onChange={(e) => setInputMinMileage(e.target.value)}
              placeholder="From"
              className={styles.inputMin}
            />
            <input
              type="number"
              value={inputMaxMileage}
              onChange={(e) => setInputMaxMileage(e.target.value)}
              placeholder="To"
              className={styles.inputMax}
            />
          </div>
        </div>

        <button type="submit" className={styles.searchBtn}>
          Search
        </button>
      </form>
      {isLoading && <p className={styles.statusText}>Loading...</p>}
      {isError && <p className={styles.errorText}>Error loading data.</p>}
      <div className={styles.carsGrid}>
        {cars.map((car) => (
          <div key={car.id} className={styles.carCard}>
            <div className={styles.imgContainer}>
              <button
                type="button"
                className={styles.favoriteBtn}
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(car.id);
                }}
              >
                <svg
                  className={`${styles.heartIcon} ${favorites.includes(car.id) ? styles.activeHeart : ""}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <img
                src={car.img}
                alt={`${car.brand} ${car.model}`}
                className={styles.cardImg}
              />
            </div>

            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                {car.brand}{" "}
                <span className={styles.accentText}>{car.model}</span>,{" "}
                {car.year}
              </h3>
              <span>${car.rentalPrice}</span>
            </div>

            {/* Теги характеристик автомобіля */}
            <div className={styles.tagsInfo}>
              <span className={styles.tagItem}>
                {car.location?.city || "N/A"} | {car.location?.country || "N/A"}
              </span>
              <span className={styles.tagItem}>{car.rentalCompany}</span>
              <span className={styles.tagItem}>{car.type}</span>
              <span className={styles.tagItem}>{car.model}</span>
              <span className={styles.tagItem}>{car.id}</span>
              <span className={styles.tagItem}>
                {car.features?.[0] ?? "Standard"}
              </span>
            </div>

            {/* Кнопка Read more для нової вкладки */}
            <a
              href={`/catalog/${car.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readMoreBtn}
            >
              Read more
            </a>
          </div>
        ))}
      </div>
      {/* Пагінація Load More */}
      {hasNextPage && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={styles.loadMoreBtn}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
