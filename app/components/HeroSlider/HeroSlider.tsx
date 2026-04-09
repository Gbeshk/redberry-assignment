"use client";
import React, { useState } from "react";
import SwiperPic1 from "../../../public/images/swiperpic1.png";
import SwiperPic2 from "../../../public/images/swiperpic2.png";
import SwiperPic3 from "../../../public/images/swiperpic3.png";
import { useRouter } from "next/navigation";
import ArrowRight from "../icons/ArrowRight";
import ArrowLeft from "../icons/ArrowLeft";

function HeroSlider() {
  const slides = [
    {
      image: SwiperPic1,
      title: "Start learning something new today",
      subtitle:
        "Explore a wide range of expert-led courses in design, development, business, and more. Find the skills you need to grow your career and learn at your own pace.",
      btnText: "Browse Courses",
    },
    {
      image: SwiperPic2,
      title: "Pick up where you left off",
      subtitle:
        "Your learning journey is already in progress. Continue your enrolled courses, track your progress, and stay on track toward completing your goals.",
      btnText: "Start Learning",
    },
    {
      image: SwiperPic3,
      title: "Learn together, grow faster",
      subtitle: null,
      btnText: "Learn more",
    },
  ];
  const btnWidths = [206, 187, 159];
  const bgPositions = ["center", "center -170px", "center -72px"];

  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));
  const router = useRouter();

  return (
    <div>
      <div className="relative w-[1566px] mx-auto mt-[64px]">
        <div className="h-[420px] rounded-[30px] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(-${current * 1566}px)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="min-w-[1566px] h-[420px] rounded-[30px] p-[48px] pb-[55px] flex flex-col justify-between"
                style={{
                  backgroundImage: `url(${slide.image.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: bgPositions[index],
                }}
              >
                <div>
                  <h1 className="text-white font-bold text-[48px] leading-[100%] tracking-normal h-[58px] flex items-center">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <h2 className="text-white font-light text-[24px] leading-[120%] tracking-normal w-[1238px] h-[58px] mt-[12px]">
                      {slide.subtitle}
                    </h2>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push("/courses")}
                    className={`bg-[#4F46E5] hover:bg-[#281ED2] active:bg-[#1E169D] focus-visible:bg-[#281ED2] focus-visible:ring-2 focus-visible:ring-[#1E169D] focus-visible:outline-none transition-colors duration-300 ease-out ${!slide.subtitle ? "mt-[81px]" : "mt-[40px]"} h-[64px] flex items-center justify-center rounded-[8px] font-medium text-[20px] leading-none tracking-normal text-white cursor-pointer`}
                    style={{ width: `${btnWidths[index]}px` }}
                  >
                    {slide.btnText}
                  </button>
                </div>

                <div className="flex h-[54px] items-center justify-between mt-[31px]">
                  <div className="h-[54px] w-[132px] opacity-0"></div>

                  <div className="flex gap-[12px] h-[54px] items-center">
                    {slides.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="w-[57px] h-[8px] rounded-[999px] cursor-pointer transition-colors duration-300"
                        style={{
                          backgroundColor:
                            i === current
                              ? "#F5F5F5"
                              : index === 1
                              ? "#ADADAD"
                              : "#C1BCBC80",
                        }}
                      />
                    ))}
                  </div>

                  <div className="h-[54px] w-[132px] opacity-0"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows fixed outside slider */}
        <div className="absolute bottom-[55px] right-[48px] flex items-center justify-between w-[132px] h-[54px]">
          <ArrowLeft onClick={prev} isDisabled={current === 0} />
          <ArrowRight onClick={next} isDisabled={current === slides.length - 1} />
        </div>
      </div>
    </div>
  );
}

export default HeroSlider;