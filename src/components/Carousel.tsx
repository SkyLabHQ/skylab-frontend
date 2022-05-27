import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { EffectCoverflow, FreeMode, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReactElement } from "react";

const Carousel = (): ReactElement => {
    return (
        <Swiper
            effect="coverflow"
            grabCursor={true}
            loop={true}
            freeMode={true}
            pagination={{
                clickable: true,
            }}
            coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            }}
            breakpoints={{
                300: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                640: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                },
            }}
            modules={[FreeMode, Pagination, EffectCoverflow]}
        >
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
            <SwiperSlide />
        </Swiper>
    );
};

export default Carousel;
