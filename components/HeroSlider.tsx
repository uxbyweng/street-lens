"use client";

import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import heroImage from "figma:asset/642dfc8c304898f759f7fedb1f882b1d0f80a6a1.png";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1691995016747-d367c51c7d65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBncmFmZml0aSUyMHdhbGwlMjB1cmJhbnxlbnwxfHx8fDE3NzQwOTk5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",

    title: "EXPLORE STREET ART IN BERLIN ",
    subtitle: "We have more than 2+ artworks to discover lots of...",
    cta: "START EXPLORING",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1691995016747-d367c51c7d65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBncmFmZml0aSUyMHdhbGwlMjB1cmJhbnxlbnwxfHx8fDE3NzQwOTk5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "DISCOVER URBAN MASTERPIECES",
    subtitle: "Lorem ipsum dolores mia di spiace con enrico eco nei lisa.",
    cta: "VIEW GALLERY",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1659354264952-88c7cea55ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG11cmFsJTIwY2l0eXxlbnwxfHx8fDE3NzQwOTk5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "COLORFUL MURALS WORLDWIDE",
    subtitle: "Lorem ipsum dolores mia di spiace con enrico eco nei lisa.",
    cta: "EXPLORE MAP",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1739838870750-6375b6d46eff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBiZXJsaW58ZW58MXx8fHwxNzc0MDk5OTA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "MEET THE ARTISTS BEHIND THE WALLS",
    subtitle: "Lorem ipsum dolores mia di spiace con enrico eco nei lisa.",
    cta: "LEARN MORE",
  },
];

export function HeroSlider() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    fade: true,
    cssEase: "ease-in-out",
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ul className="flex gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <button
        className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all"
        aria-label="Slide indicator"
      />
    ),
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)]"
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>

            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="font-fjalla text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-2">
                    {slide.title}
                  </h1>
                  {slide.cta && (
                    <div className="mt-8">
                      <p className="text-pink-500 text-sm mb-2">
                        {slide.subtitle}
                      </p>
                      <button className="inline-flex items-center gap-2 text-white font-medium text-sm hover:text-pink-500 transition-colors group">
                        <span>{slide.cta}</span>
                        <ChevronRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom Navigation Arrows */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
