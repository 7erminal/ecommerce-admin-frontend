import React from "react";

const SkillsSection: React.FC = () => {
    return (
      <section id="features" className="py-12 sm:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold-100 text-center text-gray-500 mb-4 sm:mb-8">Our Skills Framework</h2>
          <h6 className='text-sm sm:text-base font-thin text-center text-gray-700 mb-5'>We focus on four core capability areas that power employability:</h6>
          <hr className='hr mb-8 sm:mb-16'/>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-teal-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Self-Awareness</h3>
              <p className="text-gray-700">
                Understand your strengths, values,  growth areas and how to communicate them.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-cyan-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Collaboration</h3>
              <p className="text-gray-700">
                Work effectively across teams, personalities and perspectives.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-teal-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Leadership</h3>
              <p className="text-gray-700">
                Collaborate, influence, and empower others in real team environments.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-cyan-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Problem Solver</h3>
              <p className="text-gray-700">
                Turn ideas into action through projects, innovation, and impact-driven work.
                This framework is designed to build job-ready skills through real-world application beyond theory.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-teal-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Community Support</h3>
              <p className="text-gray-700">
                Connect with fellow learners, share insights, and grow together in our supportive community.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-cyan-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-teal-800 mb-4">Career Advancement</h3>
              <p className="text-gray-700">
                Boost your career prospects with certifications and skills that stand out to employers.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
};

export default SkillsSection;