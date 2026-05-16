"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getCarById, createBookingRequest } from "@/lib/api/clientApi";
import "./carDetailsTailwind.css";
import { Car, RentalSchema } from "@/types/types";

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
      alert("Помилка бронювання. Будь ласка, спробуйте ще раз.");
      console.error(error);
    },
  });

  if (isLoading)
    return (
      <div className="status-text-centered">
        Завантаження інформації про автомобіль...
      </div>
    );
  if (isError || !car)
    return <div className="error-text-centered">Автомобіль не знайдено.</div>;

  return (
    <div className="page-desktop-container">
      <div className="layout-desktop-grid">
        <div className="left-content-block">
          <div className="main-image-wrapper">
            <img
              src={car.img}
              alt={`${car.brand} ${car.model}`}
              className="car-main-image"
            />
          </div>

          <div className="booking-form-card">
            <h2 className="form-heading-title">Забронюйте авто зараз</h2>
            <p className="form-subheading-desc">
              Будьте на зв'язку! Ми завжди готові вам допомогти.
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
                <Form className="form-flex-stack">
                  <div className="input-field-wrapper">
                    <Field
                      type="text"
                      name="name"
                      placeholder="Ім'я*"
                      className={`form-input-base ${touched.name && errors.name ? "input-border-error" : "input-border-normal"}`}
                    />
                    <ErrorMessage
                      name="name"
                      component="span"
                      className="form-error-msg"
                    />
                  </div>

                  <div className="input-field-wrapper">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email*"
                      className={`form-input-base ${touched.email && errors.email ? "input-border-error" : "input-border-normal"}`}
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="form-error-msg"
                    />
                  </div>

                  <div className="input-field-wrapper">
                    <Field
                      as="textarea"
                      name="comment"
                      placeholder="Коментар"
                      rows={4}
                      className="form-input-base resize-none input-border-normal"
                    />
                    <ErrorMessage
                      name="comment"
                      component="span"
                      className="form-error-msg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rentalMutation.isPending || isSubmitting}
                    className="form-submit-btn"
                  >
                    {rentalMutation.isPending ? "Надсилання..." : "Надіслати"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="right-content-block">
          <div>
            <div className="flex justify-between items-baseline">
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}, {car.year}
              </h1>
              <span className="text-gray-300 text-sm font-medium">
                Id: {car.id}
              </span>
            </div>
            <div className="car-meta-line">
              <span>
                {car.location.city}, {car.location.country}
              </span>
              <span className="dot-divider">•</span>
              <span>Пробіг: {car.mileage.toLocaleString()} км</span>
            </div>
            <p className="car-price-tag">${car.rentalPrice}</p>
          </div>

          <p className="car-description-body">{car.description}</p>

          <div>
            <h3 className="specs-section-title">
              Умови оренди (Rental Conditions):
            </h3>
            <ul className="conditions-list-stack">
              {car.rentalConditions.map((condition, idx) => (
                <li key={idx} className="condition-item-row">
                  <span className="condition-check-badge">✓</span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="specs-section-title">
              Характеристики авто (Car Specifications):
            </h3>
            <ul className="specs-list-stack">
              <li className="spec-item-row">
                <span className="bullet-point-dot" />
                Рік випуску: {car.year}
              </li>
              <li className="spec-item-row">
                <span className="bullet-point-dot" />
                Тип кузова: {car.type}
              </li>
              <li className="spec-item-row">
                <span className="bullet-point-dot" />
                Витрата палива: {car.fuelConsumption} л/100км
              </li>
              <li className="spec-item-row">
                <span className="bullet-point-dot" />
                Об'єм двигуна: {car.engine}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="specs-section-title">
              Аксесуари та функціонал (Accessories and functionalities):
            </h3>
            <ul className="specs-list-stack">
              {car.features.map((feature, idx) => (
                <li key={idx} className="spec-item-row">
                  <span className="bullet-point-dot" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-fixed-overlay">
          <div className="modal-content-card">
            <div className="modal-success-badge">✓</div>
            <h3 className="modal-success-title">Оренда підтверджена! 🎉</h3>
            <p className="modal-success-desc">
              Ваша заявка на автомобіль{" "}
              <strong>
                {car?.brand} {car?.model}
              </strong>{" "}
              успішно надіслана. Наш менеджер зв'яжеться з вами найближчим
              часом.
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="modal-action-btn"
            >
              Чудово, дякую!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
