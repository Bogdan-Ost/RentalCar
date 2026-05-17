"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getCarById, createBookingRequest } from "@/lib/api/clientApi";
import { Car, RentalSchema } from "@/types/types";
import styles from "./carDetails.module.css";
import {
  CalendarIcon,
  CarTypeIcon,
  CheckIcon,
  EngineIcon,
  FuelIcon,
} from "@/components/icons/CarIcons";

export default function CarDetailsPage() {
  const { carId } = useParams<{ carId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Поточний carId з URL-адреси:", carId);

  const {
    data: car,
    isLoading,
    isError,
  } = useQuery<Car>({
    queryKey: ["car", carId],
    queryFn: () => getCarById(carId),
    enabled: !!carId,
  });

  const rentalMutation = useMutation({
    mutationFn: (bookingData: {
      name: string;
      email: string;
      comment: string;
    }) => createBookingRequest(carId, bookingData),
    onSuccess: () => {
      setIsModalOpen(true);
    },
    onError: (error) => {
      alert("Booking error. Please try again.");
      console.error(error);
    },
  });

  if (isLoading)
    return (
      <div className={styles.statusTextCentered}>
        Loading car information...
      </div>
    );
  if (isError || !car)
    return <div className={styles.errorTextCentered}>Car not found.</div>;

  return (
    <div className={styles.pageDesktopContainer}>
      <div className={styles.layoutDesktopGrid}>
        {/* Ліва колонка: Фото та Форма */}
        <div className={styles.leftContentBlock}>
          <div className={styles.mainImageWrapper}>
            <Image
              src={car.img}
              alt={`${car.brand} ${car.model}`}
              fill
              priority
              className={styles.carMainImage}
            />
          </div>

          <div className={styles.bookingFormCard}>
            <h2 className={styles.formHeadingTitle}>Book your car now</h2>
            <p className={styles.formSubheadingDesc}>
              Stay connected! We are always ready to help you.
            </p>

            <Formik
              initialValues={{ name: "", email: "", comment: "" }}
              validationSchema={RentalSchema}
              onSubmit={(values, { resetForm }) => {
                rentalMutation.mutate(values, {
                  onSuccess: () => resetForm(),
                });
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className={styles.formFlexStack}>
                  <div className={styles.inputFieldWrapper}>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Name*"
                      className={`${styles.formInputBase} ${touched.name && errors.name ? styles.inputBorderError : styles.inputBorderNormal}`}
                    />
                    <ErrorMessage
                      name="name"
                      component="span"
                      className={styles.formErrorMsg}
                    />
                  </div>

                  <div className={styles.inputFieldWrapper}>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email*"
                      className={`${styles.formInputBase} ${touched.email && errors.email ? styles.inputBorderError : styles.inputBorderNormal}`}
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className={styles.formErrorMsg}
                    />
                  </div>

                  <div className={styles.inputFieldWrapper}>
                    <Field
                      as="textarea"
                      name="comment"
                      placeholder="Comment"
                      rows={4}
                      className={`${styles.formInputBase} ${styles.resizeNone} ${styles.inputBorderNormal}`}
                    />
                    <ErrorMessage
                      name="comment"
                      component="span"
                      className={styles.formErrorMsg}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rentalMutation.isPending || isSubmitting}
                    className={styles.formSubmitBtn}
                  >
                    {rentalMutation.isPending ? "Sending..." : "Send"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className={styles.rightContentBlock}>
          <div className={styles.headerTitleBlock}>
            <div className={styles.titleRow}>
              <h1 className={styles.carTitleMain}>
                {car.brand} {car.model}, {car.year}
              </h1>
              <span className={styles.carIdBadge}># {car.id}</span>
            </div>
            <div className={styles.carMetaLine}>
              <span>
                {car.location.city}, {car.location.country}
              </span>
              <span className={styles.dotDivider}>|</span>
              <span>Mileage: {car.mileage.toLocaleString()} km</span>
            </div>
            <p className={styles.carPriceTag}>${car.rentalPrice}</p>
          </div>
          <p className={styles.carDescriptionBody}>{car.description}</p>
          <div className={styles.specsGroupContainer}>
            <div className={styles.specsSection}>
              <h3 className={styles.specsSectionTitle}>Rental Conditions:</h3>
              <ul className={styles.conditionsListStack}>
                {car.rentalConditions.map((condition, idx) => (
                  <li key={idx} className={styles.conditionItemRow}>
                    <CheckIcon className={styles.conditionCheckIcon} />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.specsSection}>
              <h3 className={styles.specsSectionTitle}>Car Specifications:</h3>
              <ul className={styles.specsListGrid}>
                <li className={styles.specItemRow}>
                  <CalendarIcon className={styles.specIcon} />
                  <span className={styles.specLabel}>Year:</span> {car.year}
                </li>
                <li className={styles.specItemRow}>
                  <CarTypeIcon className={styles.specIcon} />
                  <span className={styles.specLabel}>Type:</span> {car.type}
                </li>
                <li className={styles.specItemRow}>
                  <FuelIcon className={styles.specIcon} />
                  <span className={styles.specLabel}>
                    Fuel Consumption:
                  </span>{" "}
                  {car.fuelConsumption}
                </li>
                <li className={styles.specItemRow}>
                  <EngineIcon className={styles.specIcon} />
                  <span className={styles.specLabel}>Engine Size:</span>{" "}
                  {car.engine}
                </li>
              </ul>
            </div>

            <div className={styles.specsSection}>
              <h3 className={styles.specsSectionTitle}>
                Accessories and functionalities:
              </h3>
              <ul className={styles.accessoriesListColumn}>
                {car.features.map((feature, idx) => {
                  const cleanFeature = feature.replace(/^-\s*/, "");
                  return (
                    <li key={idx} className={styles.featureItemRow}>
                      <CheckIcon className={styles.accessoryCheckIcon} />
                      {cleanFeature}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>{" "}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalFixedOverlay}>
          <div className={styles.modalContentCard}>
            <div className={styles.modalSuccessBadge}>✓</div>
            <h3 className={styles.modalSuccessTitle}>Booking Confirmed! 🎉</h3>
            <p className={styles.modalSuccessDesc}>
              Your request for{" "}
              <strong>
                {car?.brand} {car?.model}
              </strong>{" "}
              has been successfully sent. Our manager will contact you soon.
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className={styles.modalActionBtn}
            >
              Great, thank you!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
