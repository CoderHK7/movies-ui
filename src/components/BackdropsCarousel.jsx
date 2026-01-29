import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function BackdropsCarousel({ backdrops }) {
  if (!backdrops || backdrops.length === 0) return null;

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0b0b0b",
      }}
    >
      {/* 16:9 container */}
      <div style={{ width: "100%", aspectRatio: "16 / 9" }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop={backdrops.length > 1}
          style={{ width: "100%", height: "100%" }}
        >
          {backdrops.map((url, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={url}
                alt={`backdrop-${idx}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
