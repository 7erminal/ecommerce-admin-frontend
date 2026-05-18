import React from "react";
import CustomNav from "../components/CustomNav";
import { useParallax } from "react-scroll-parallax";
import SkillsSection from "../widgets/SkillsSection";
import Footer from "../widgets/Footer";

const AboutPage: React.FC = () => {
  const parallax = useParallax<HTMLDivElement>({
    translateX: [0, 0, 'easeOutQuint'],
    translateY: [20, -60, 'easeInQuint'],
  });
  
    return <div className="bg-white">
        <CustomNav />
        <style>{`
          .diagonal-split {
            position: relative;
            height: 25vh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .diagonal-split::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #e5e7eb 0%, #e5e7eb 55%, #9ca3af 55%, #9ca3af 100%);
            z-index: 0;
          }
          
          .diagonal-split-content {
            position: relative;
            z-index: 10;
            text-align: center;
          }
        `}</style>
        
        <section className="diagonal-split">
          <div className="diagonal-split-content">
            <h1 ref={parallax.ref} className="text-5xl md:text-6xl font-bold text-gray-800">About Us</h1>
          </div>
        </section>
        <div className="max-w-6xl mx-auto mt-10 grid grid-cols-3 md:grid-cols-3 sm:grid-cols-1">
          <div className="col-span-2 font-light p-6">
            {/* <h2 className="text-4xl font-bold text-teal-800 mb-6">About SkillBuilder</h2> */}
            <p className="text-gray-700 text-lg mb-4">
              We’re building a <b>global digital skills and employability platform</b> designed for young people who want more than certificates.
            </p>
            <p className="text-gray-700 text-lg mb-4">
              Our platform helps you <b>learn by doing</b> — combining structured learning, real projects, and global collaboration to turn potential into practical, job-ready skills.
            </p>
            <p className="text-gray-700 text-lg mb-6">
              Whether you’re preparing for your first role or building experience for the next one, the platform gives you the tools, exposure, and community to move forward with confidence.
            </p>
          </div>
          <div className="col-span-1 p-6" style={{backgroundImage: 'url("/sci-fi.jpg")', backgroundPosition: 'center', backgroundSize: 'cover'}}></div>
            {/* <div className="flex space-x-8">
              <div>
                <div className="text-3xl font-bold text-teal-600">500+</div>
                <div className="text-gray-700">Video Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">50+</div>
                <div className="text-gray-700">Courses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">10K+</div>
                <div className="text-gray-700">Active Learners</div>
              </div>
            </div> */}
          </div>
          <SkillsSection />
          <Footer />
    </div>
}

export default AboutPage