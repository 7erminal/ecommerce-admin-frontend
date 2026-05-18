import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ARoutes from './ARoutes.tsx'
// import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'
import 'swiper/css/pagination'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ARoutes />
  </StrictMode>,
)
