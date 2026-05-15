"use client";

import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Select, { StylesConfig } from "react-select";
import styles from "./catalog.module.css";
import { getCars } from "@/lib/api/clientApi";

const brandOptions = [
  { value: "Aston Martin", label: "Aston Martin" },
  { value: "Audi", label: "Audi" },
  { value: "Bentley", label: "Bentley" },
  { value: "BMW", label: "BMW" },
  { value: "Buick", label: "Buick" },
  { value: "Chevrolet", label: "Chevrolet" },
  { value: "HUMMER", label: "HUMMER" },
  { value: "Subaru", label: "Subaru" },
];

const priceOptions = Array.from({ length: 13 }, (_, i) => {
  const value = String((i + 3) * 10);
  return { value, label: value };
});

export default function CatalogPage() {
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
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 12 ? allPages.length + 1 : undefined;
    },
  });

  const cars = data?.pages.flat() || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryBrand(selectedBrand?.value || "");
    setQueryPrice(selectedPrice?.value || "");
    setQueryMinMileage(inputMinMileage ? Number(inputMinMileage) : undefined);
    setQueryMaxMileage(inputMaxMileage ? Number(inputMaxMileage) : undefined);
  };

  const customSelectStyles = (width: string): StylesConfig<any, false> => ({
    control: (provided, state) => ({
      ...provided,
      width,
      height: "48px",
      backgroundColor: "#F7F7FB",
      borderRadius: "14px",
      border: "none",
      boxShadow: "none",
      paddingLeft: "8px",
      fontFamily: "inherit",
      fontSize: "18px",
      fontWeight: "500",
      color: "#121417",
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#121417",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#121417",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#121417",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
      transition: "transform 0.2s ease",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#FFFFFF",
      borderRadius: "14px",
      border: "1px solid rgba(18, 20, 23, 0.05)",
      boxShadow: "0px 4px 36px 0px rgba(0, 0, 0, 0.02)",
      padding: "8px",
      zIndex: 100,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "272px",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(18, 20, 23, 0.05)",
        borderRadius: "10px",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      color: state.isSelected ? "#121417" : "rgba(18, 20, 23, 0.2)",
      fontSize: "16px",
      fontWeight: "500",
      padding: "8px 12px",
      cursor: "pointer",
      "&:hover": {
        color: "#121417",
        backgroundColor: "rgba(18, 20, 23, 0.03)",
      },
    }),
  });

  const getShortAddress = (address?: string) => {
    if (!address || typeof address !== "string") return "N/A";
    const parts = address.split(",");
    if (parts.length < 3) return address;
    return `${parts[parts.length - 2].trim()} | ${parts[parts.length - 1].trim()}`;
  };

  return (
    <div className={styles.catalog}>
      <form onSubmit={handleSearchSubmit} className={styles.filterForm}>
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Car brand</label>
          <Select
            options={brandOptions}
            value={selectedBrand}
            onChange={(option) => setSelectedBrand(option)}
            placeholder="Choose a brand"
            styles={customSelectStyles("224px")}
            isSearchable={true} // Дозволяє вводити текст пошуку як у макеті
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.label}>Price / 1 hour</label>
          <Select
            options={priceOptions}
            value={selectedPrice}
            onChange={(option) => setSelectedPrice(option)}
            placeholder="To $"
            styles={customSelectStyles("125px")}
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
              <span>{car.rentalPrice}</span>
            </div>

            <div className={styles.tagsInfo}>
              <span className={styles.tagItem}>
                {getShortAddress(car.address)}
              </span>
              <span className={styles.tagItem}>{car.rentalCompany}</span>
              <span className={styles.tagItem}>{car.type}</span>
              <span className={styles.tagItem}>{car.model}</span>
              <span className={styles.tagItem}>{car.id}</span>
              <span className={styles.tagItem}>
                {car.functionalities?.[0] ?? "No functionalities"}
              </span>
            </div>

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
