"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta?: string;
  href?: string;
  imagePositionX?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/slider_image_001.jpg",
    title: "EXPLORE STREET ART IN BERLIN",
    subtitle:
      "Navigate the city's streets and find the best murals in real-time",
    cta: "Start exploring",
    href: "/artworks",
    imagePositionX: "80%",
  },
  {
    id: 2,
    image: "/images/slider_image_002.jpg",
    title: "DISCOVER URBAN ARTWORKS",
    subtitle: "Locate iconic walls and underground masterpieces near you.",
    cta: "Open the map",
    href: "/map",
    imagePositionX: "60%",
  },
  {
    id: 3,
    image: "/images/slider_image_003.jpg",
    title: "UNCOVER HIDDEN GEMS",
    subtitle: "Discover vibrant stories painted on Berlin's concrete canvas.",
    cta: "Browse artworks",
    href: "/artworks",
    imagePositionX: "30%",
  },
  {
    id: 4,
    image: "/images/slider_image_004.jpg",
    title: "TRACK ART ACROSS THE CITY",
    subtitle: "Find new spots and create your own urban art routes.",
    cta: "Map it out",
    href: "/map",
    imagePositionX: "75%",
  },
];

export function HeroSlider() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    fade: true,
    cssEase: "ease-in-out",
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
              <Image
                src={slide.image}
                alt={slide.title}
                width={800}
                height={450}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                priority
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `${slide.imagePositionX ?? "50%"} center`,
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 to-transparent" />
            </div>

            <div className="relative h-full flex items-center">
              <div className="max-w-6xl mx-auto px-4 w-full">
                <div className="max-w-2xl">
                  <h1 className="font-fjalla text-6xl md:text-7xl text-white leading-none mb-2 mt-40 lg:mt-80">
                    {slide.title}
                  </h1>
                  {slide.cta && slide.href ? (
                    <div className="mt-8">
                      <h2 className="mb-4 text-2xl lg:text-4xl text-pink-500 font-bold lg:font-medium">
                        {slide.subtitle}
                      </h2>
                      <Button className="w-full md:w-auto">
                        <a
                          href={slide.href}
                          className="group inline-flex items-center gap-2 text-lg"
                        >
                          <span>{slide.cta}</span>
                          <ChevronRight
                            size={20}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom Navigation Arrows */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all backdrop-blur-sm hover:bg-white/20 md:left-8 md:flex md:h-16 md:w-16"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all backdrop-blur-sm hover:bg-white/20 md:right-8 md:flex md:h-16 md:w-16"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
