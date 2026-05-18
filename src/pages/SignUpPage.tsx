import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

interface SignupFormInputs {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  password: string;
  confirmPassword: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormInputs) => {
    console.log("Signup Data:", data);
    // TODO: Call signup API endpoint
    // For now, just navigate to login
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff5f5] px-4 py-10 font-['Poppins',sans-serif] md:px-8">
      <div className="pointer-events-none absolute -left-28 -top-20 h-72 w-72 rounded-full bg-[#fbd5d5] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-[#f8b4b4] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#fecaca] blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#f8d2d2] bg-white shadow-[0_20px_65px_rgba(197,48,48,0.17)] lg:grid-cols-2">
        <aside className="relative hidden bg-gradient-to-br from-[#c53030] via-[#b91c1c] to-[#8f1414] p-10 text-white lg:block">
          <div className="absolute -left-12 top-20 h-44 w-44 rounded-full border border-white/25" />
          <div className="absolute bottom-10 right-8 h-28 w-28 rounded-2xl bg-white/10" />

          <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.18em]">
            Ecommerce Admin
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Launch Faster.
            <br />
            Scale Confidently.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-[#fee2e2]">
            Build your seller profile and unlock product listings, analytics, and real-time order management.
          </p>

          <div className="mt-12 space-y-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-[#fecaca]">New Merchants</p>
              <p className="mt-1 text-xl font-semibold">+125 this week</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-[#fecaca]">Avg Setup</p>
              <p className="mt-1 text-xl font-semibold">Under 5 Minutes</p>
            </div>
          </div>
        </aside>

        <section className="p-6 sm:p-10">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f1] lg:mx-0">
              <svg className="h-7 w-7 text-[#c53030]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold text-[#7f1d1d]">Create Account</h2>
            <p className="mt-2 text-sm text-[#9f3a3a]">Start your ecommerce journey today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] px-4 py-3 text-[#7f1d1d] outline-none transition placeholder:text-[#d08484] focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && <p className="mt-2 text-xs text-[#c53030]">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] px-4 py-3 text-[#7f1d1d] outline-none transition placeholder:text-[#d08484] focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="mt-2 text-xs text-[#c53030]">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] px-4 py-3 text-[#7f1d1d] outline-none transition placeholder:text-[#d08484] focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9\s\-\+\(\)]+$/,
                    message: "Invalid phone number format",
                  },
                  minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits",
                  },
                })}
              />
              {errors.phoneNumber && <p className="mt-2 text-xs text-[#c53030]">{errors.phoneNumber.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Date of Birth</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] px-4 py-3 text-[#7f1d1d] outline-none transition focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                  {...register("dateOfBirth", {
                    required: "Date of birth is required",
                  })}
                />
                {errors.dateOfBirth && <p className="mt-2 text-xs text-[#c53030]">{errors.dateOfBirth.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Gender</label>
                <select
                  className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] px-4 py-3 text-[#7f1d1d] outline-none transition focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="mt-2 text-xs text-[#c53030]">{errors.gender.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] px-4 py-3 text-[#7f1d1d] outline-none transition placeholder:text-[#d08484] focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && <p className="mt-2 text-xs text-[#c53030]">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] px-4 py-3 text-[#7f1d1d] outline-none transition placeholder:text-[#d08484] focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && <p className="mt-2 text-xs text-[#c53030]">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#c53030] to-[#a51f1f] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(197,48,48,0.35)]"
            >
              Create Account
            </button>

            <p className="pt-2 text-center text-sm text-[#8d3f3f]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#c53030] hover:text-[#9f1d1d]">
                Sign In
              </Link>
            </p>
          </form>

          <p className="mt-8 text-center text-xs text-[#b05757] lg:text-left">© 2026 Animo Commerce. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
}

export default SignUpPage;