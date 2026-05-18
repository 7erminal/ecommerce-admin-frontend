import React, { useEffect, useContext } from "react";
import ApplicationContext from "../../../resources/providers/ApplicationContext";

const CustomizePage: React.FC = () => {
    const applicationContext = useContext(ApplicationContext);

    useEffect(()=>{
        document.title = "Home"
        getCourses();
        getCategories();
    }, [])

    const getCategories = async () => {
        await applicationContext!.fetchCategories();
    }

    const getCourses = async () => {
        await applicationContext!.getCourses();
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