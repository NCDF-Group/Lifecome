"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: "/images/team-doctors.webp",
    title: "Expert medical care right at your fingertips",
    description: "Connect with certified doctors, get prescriptions, and schedule consultations anytime, anywhere.",
  },
  {
    image: "/images/service-family.webp",
    title: "Comprehensive care for your whole family",
    description: "One unified platform for HMO access, emergency care, and routine health protection for your loved ones.",
  },
];

export function AuthCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-full min-h-dvh w-full flex-col justify-end p-8 sm:p-12 lg:p-14 text-white overflow-hidden">
      {/* Background carousel images with pure, smooth opacity crossfade */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.image}
            style={{
              transition: "opacity 2s ease-in-out",
            }}
            className={`absolute inset-0 ${
              isActive
                ? "opacity-100 z-0"
                : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority={index === 0}
            />
            {/* Gradient overlay for text contrast over pictures */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          </div>
        );
      })}

      {/* Bottom Text Content Overlay - text directly over pictures */}
      <div className="relative z-10 space-y-6 max-w-xl pb-2">
        {/* Text Slides Stack with smooth opacity dissolve */}
        <div className="grid grid-cols-1 grid-rows-1">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.title}
                style={{
                  transition: "opacity 1.5s ease-in-out",
                }}
                className={`col-start-1 row-start-1 space-y-2 ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <h2 className="text-xl font-bold leading-tight text-white drop-shadow-md sm:text-2xl lg:text-3xl">
                  {slide.title}
                </h2>
                <p className="text-sm leading-relaxed text-white/90 drop-shadow sm:text-base">
                  {slide.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots (Scrollbar) placed under content */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{ transition: "all 0.5s ease-in-out" }}
              className={`h-2 rounded-full ${
                i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
