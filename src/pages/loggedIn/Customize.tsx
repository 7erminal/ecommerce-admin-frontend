import React, { useState, useEffect, useContext } from "react";
import ApplicationContext from "../../../resources/providers/ApplicationContext";
import VideoTile from "../../widgets/VideoTile";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

const CustomizePage: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        document.title = "Home"
        getCourses();
        getCategories();
    }, [])

    const getCategories = async () => {
        setLoading(true);
        await applicationContext!.fetchCategories();
        setLoading(false);
    }

    const getCourses = async () => {
        setLoading(true);
        await applicationContext!.getCourses();
        setLoading(false);
    }

    return <div className="flex flex-col whitespace-normal p-4">
        <section className="mb-6">
        {/* <h3 className="text-2xl font-semibold mb-4 mt-10">Categories</h3> */}
        {/* {
            applicationContext?.categories.length === 0 ? <div>No categories found.</div> :
            <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 }
                }}
                spaceBetween={20}
                navigation
                pagination={{ clickable: true }}
                className="mySwiper"
            >
                {
                    applicationContext!.categories.map((category, index) => (
                        <SwiperSlide key={index}>
                        <div  className="bg-white rounded-lg shadow-md p-2 flex flex-col items-center my-4">
                            <div className="text-sm mb-4">{category.name}</div>
                        </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        } */}
        </section>
        <section></section>
    </div>
}

export default CustomizePage;