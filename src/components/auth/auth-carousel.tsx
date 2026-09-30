"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  image: string;
  badge: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: "/images/team-doctors.webp",
    badge: "QUALIFIED DOCTORS",
    title: "Expert medical care right at your fingertips",
    description: "Connect with certified doctors, get prescriptions, and schedule consultations anytime, anywhere.",
  },
  {
    image: "/images/service-family.webp",
    badge: "FAMILY HEALTHCARE",
    title: "Comprehensive care for your whole family",
    description: "One unified platform for HMO access, emergency care, and routine health protection for your loved ones.",
  },
];

export function AuthCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-full min-h-dvh w-full flex-col justify-end p-8 sm:p-12 lg:p-14 text-white">
      {/* Background carousel images */}
      {slides.map((slide, index) => (
        <div
          key={slide.badge}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
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
          {/* Gradient overlay for contrast & readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
        </div>
      ))}

      {/* Bottom Caption Overlay */}
      <div className="relative z-10 space-y-4 rounded-2xl border border-white/15 bg-black/40 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200 backdrop-blur-sm">
            {slides[currentSlide].badge}
          </span>

          {/* Navigation Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-7 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
          {slides[currentSlide].title}
        </h2>
        <p className="text-sm leading-relaxed text-white/80 sm:text-base">
          {slides[currentSlide].description}
        </p>
      </div>
    </div>
  );
}
