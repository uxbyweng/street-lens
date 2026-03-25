"use client";

import { useRef, useState } from "react";
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
  const [activeSlide, setActiveSlide] = useState(0);

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
    accessibility: true,
    beforeChange: (_current: number, next: number) => {
      setActiveSlide(next);
    },
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured artworks and navigation"
      className="relative h-[calc(100vh-5rem)] w-full overflow-hidden"
    >
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className="relative h-[calc(100vh-5rem)]"
            >
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt=""
                  width={800}
                  height={450}
                  sizes="100vw"
                  priority={index === 0}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: `${slide.imagePositionX ?? "50%"} center`,
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#000514] via-[#000514]/55 to-transparent" />
              </div>

              <div className="relative flex h-full items-center">
                <div className="mx-auto w-full max-w-6xl px-4">
                  <div className="max-w-2xl">
                    <h1 className="mb-2 mt-40 font-fjalla text-6xl leading-none text-white md:text-7xl lg:mt-80">
                      {slide.title}
                    </h1>

                    {slide.cta && slide.href ? (
                      <div className="mt-8">
                        <h2 className="mb-4 text-2xl font-bold text-pink-500 lg:text-4xl lg:font-medium">
                          {slide.subtitle}
                        </h2>

                        <Button asChild className="w-full md:w-auto">
                          <Link
                            href={slide.href}
                            tabIndex={isActive ? 0 : -1}
                            className="group inline-flex items-center gap-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                          >
                            <span>{slide.cta}</span>
                            <ChevronRight
                              size={20}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </Link>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:left-8 md:flex md:h-16 md:w-16"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:right-8 md:flex md:h-16 md:w-16"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>
    </section>
  );
}
