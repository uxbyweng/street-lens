"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta?: string;
  href?: string;
  imagePositionX?: string;
  alt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/slider_image_001.jpg",
    title: "EXPLORE STREET ART IN BERLIN",
    subtitle: "Navigate berlin's streets and find the best murals",
    cta: "Start exploring",
    href: "/artworks",
    imagePositionX: "80%",
    alt: "Night scene in Berlin featuring a detailed paste-up of 'Faye the Fox' by street artist Dared. The anthropomorphic fox wears a blue dress and hat against a green backdrop, placed on a pillar next to a glowing shop window and blurred cafe seating.",
  },
  {
    id: 2,
    image: "/images/slider_image_002.jpg",
    title: "DISCOVER URBAN ARTWORKS",
    subtitle: "Locate iconic walls and masterpieces near you.",
    cta: "Open the map",
    href: "/map",
    imagePositionX: "60%",
    alt: "Night view of a residential building in Berlin-Kreuzberg featuring the iconic large-scale mural 'Astronaut Cosmonaut' by Victor Ash. The stencil-style artwork depicts a floating astronaut in black and white, towering over the urban cityscape.",
  },
  {
    id: 3,
    image: "/images/slider_image_003.jpg",
    title: "UNCOVER HIDDEN GEMS",
    subtitle: "Discover vibrant painted walls in Berlin.",
    cta: "Browse artworks",
    href: "/artworks",
    imagePositionX: "30%",
    alt: "A vibrant brick wall in a Berlin courtyard at night, heavily covered with various graffiti tags, stickers, and urban posters. The scene captures the raw subculture of the city, showcasing layered street art characters and colorful textures.",
  },
  {
    id: 4,
    image: "/images/slider_image_004.jpg",
    title: "DISCOVER HIDDEN STREET ART SPOTS",
    subtitle: "Find new murals and build your own urban art routes.",
    cta: "Map it out",
    href: "/map",
    imagePositionX: "75%",
    alt: "Atmospheric evening at Holzmarkt 25 by the Spree in Berlin, showing the 'Pampa' area with fairy lights and a sun sail. In the background, the colorful mural 'Big Business!' by artist Cranio is visible on a creative residential and studio building.",
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
      className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] w-full overflow-hidden"
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
                  alt={slide.alt}
                  width={800}
                  height={450}
                  sizes="100vw"
                  priority={index === 0}
                  className="h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] w-full object-cover"
                  style={{
                    objectPosition: `${slide.imagePositionX ?? "50%"} center`,
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#000514] via-[#000514]/55 to-transparent" />
              </div>

              <div className="relative flex h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)]">
                <div className="mx-auto w-full max-w-6xl px-4">
                  <div className="flex h-full max-w-2xl flex-col pt-14 md:block md:pt-0">
                    <div className="min-h-60 md:min-h-0">
                      <h1 className="font-fjalla mt-50 text-5xl leading-none text-white md:mt-50 md:text-7xl">
                        {slide.title}
                      </h1>
                    </div>

                    {slide.cta && slide.href ? (
                      <>
                        <div className="mt-4 h-20 md:mt-8 md:h-auto">
                          <h2 className="font-fjalla text-2xl leading-tight text-gray-400 md:text-4xl">
                            {slide.subtitle}
                          </h2>
                        </div>

                        <div className="mt-auto pb-2.5 md:mt-8 md:pb-0">
                          <Button asChild className="w-full sm:w-auto">
                            <Link
                              href={slide.href}
                              tabIndex={isActive ? 0 : -1}
                              className="group inline-flex items-center gap-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                            >
                              <span>{slide.cta}</span>
                              <IconChevronRight
                                size={30}
                                stroke={4}
                                className="transition-transform group-hover:translate-x-1"
                              />
                            </Link>
                          </Button>
                        </div>
                      </>
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
        className="cursor-pointer absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:left-8 md:flex md:h-16 md:w-16"
        aria-label="Previous slide"
      >
        <IconChevronLeft size={40} />
      </button>

      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="cursor-pointer absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:right-8 md:flex md:h-16 md:w-16"
        aria-label="Next slide"
      >
        <IconChevronRight size={40} />
      </button>
    </section>
  );
}
