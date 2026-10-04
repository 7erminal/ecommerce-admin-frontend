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

        <section className="relative overflow-hidden bg-gradient-to-br from-[#c53030] via-[#b91c1c] to-[#8f1414] px-4 py-16 text-white md:py-24">
            <div className="pointer-events-none absolute -left-28 -top-20 h-72 w-72 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-white/10" />

            <div className="relative mx-auto max-w-4xl text-center">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.18em]">
                    Animo Commerce
                </p>
                <h1 ref={parallax.ref} className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">About Us</h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm text-[#fee2e2]">
                    The team and the thinking behind the commerce platform.
                </p>
            </div>
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-10 md:px-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2">
                <p className="text-lg font-light leading-relaxed text-gray-700">
                    We’re building a <b>global digital skills and employability platform</b> designed for young people who want more than certificates.
                </p>
                <p className="mt-4 text-lg font-light leading-relaxed text-gray-700">
                    Our platform helps you <b>learn by doing</b> — combining structured learning, real projects, and global collaboration to turn potential into practical, job-ready skills.
                </p>
                <p className="mt-4 text-lg font-light leading-relaxed text-gray-700">
                    Whether you’re preparing for your first role or building experience for the next one, the platform gives you the tools, exposure, and community to move forward with confidence.
                </p>
            </div>

            <div
                className="overflow-hidden rounded-2xl border border-red-100 bg-red-50 bg-cover bg-center shadow-sm"
                style={{ backgroundImage: 'url("/sci-fi.jpg")' }}
            >
                <span className="sr-only">Platform preview</span>
            </div>
        </section>

        <SkillsSection />
        <Footer />
    </div>
}

export default AboutPage
