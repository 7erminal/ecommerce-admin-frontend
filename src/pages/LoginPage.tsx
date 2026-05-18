import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import ApplicationContext from "../../resources/providers/ApplicationContext";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login, loading, error } = useLogin();
  const applicationContext = useContext(ApplicationContext);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data.username, data.password);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff5f5] px-4 py-10 font-['Poppins',sans-serif] md:px-8">
      {applicationContext?.loading ? <LoadingOverlay /> : null}
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
            Sell Smarter.
            <br />
            Manage Faster.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-[#fee2e2]">
            Monitor products, orders, and customers from one dashboard built for modern commerce teams.
          </p>

          <div className="mt-12 space-y-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-[#fecaca]">Today</p>
              <p className="mt-1 text-xl font-semibold">84 New Orders</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-[#fecaca]">Flash Deal</p>
              <p className="mt-1 text-xl font-semibold">Cart Recovery +18%</p>
            </div>
          </div>
        </aside>

        <section className="p-6 sm:p-10">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f1] lg:mx-0">
              <svg className="h-7 w-7 text-[#c53030]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3 6h2l1.2 8.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="20" r="1.25" />
                <circle cx="17" cy="20" r="1.25" />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold text-[#7f1d1d]">Welcome Back</h2>
            <p className="mt-2 text-sm text-[#9f3a3a]">Sign in to your commerce control center</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-[#f8b4b4] bg-[#fff1f1] p-3 text-sm text-[#9f1d1d]">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Username</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d06a6a]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.1 19a8 8 0 0113.8 0M15 8a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] py-3 pl-10 pr-3 text-[#7f1d1d] outline-none transition placeholder:text-[#d08484] focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                  disabled={loading}
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                />
              </div>
              {errors.username && <p className="mt-2 text-xs text-[#c53030]">{errors.username.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#7f1d1d]">Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#d06a6a]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.1 0 2 .9 2 2v2H10v-2c0-1.1.9-2 2-2zm5 4v-3a5 5 0 10-10 0v3a2 2 0 00-2 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 00-2-2z" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#f0baba] bg-[#fffafa] py-3 pl-10 pr-3 text-[#7f1d1d] outline-none transition placeholder:text-[#d08484] focus:border-[#c53030] focus:ring-4 focus:ring-[#f9caca]"
                  disabled={loading}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && <p className="mt-2 text-xs text-[#c53030]">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-[#9f3a3a]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#e79f9f] text-[#c53030] focus:ring-[#f6b5b5]" disabled={loading} />
                Remember me
              </label>
              <a href="#" className="font-medium text-[#c53030] hover:text-[#9f1d1d]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#c53030] to-[#a51f1f] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(197,48,48,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="pt-2 text-center text-sm text-[#8d3f3f]">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-[#c53030] hover:text-[#9f1d1d]">
                Create Seller Account
              </Link>
            </p>
          </form>

          <p className="mt-8 text-center text-xs text-[#b05757] lg:text-left">© 2026 Animo Commerce. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;