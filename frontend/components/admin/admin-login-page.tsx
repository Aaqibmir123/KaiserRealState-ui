"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BadgeCheck, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { useLoginMutation, useMeQuery } from "@/frontend/store/api/kasierApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, isLoading: sessionLoading } = useMeQuery();
  const [login, { isLoading, error }] = useLoginMutation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.authenticated) {
      router.replace("/admin/dashboard");
    }
  }, [router, session]);

  async function onSubmit(values: LoginInput) {
    const result = await login(values);
    if ("data" in result) {
      router.replace("/admin/dashboard");
    }
  }

  if (sessionLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-forest-50 text-forest-950">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.08),transparent_24%),linear-gradient(180deg,#f9f9f9_0%,#eef4f1_100%)] px-4 py-8 sm:px-5 sm:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <div className="relative hidden overflow-hidden rounded-sm border border-forest-900/10 bg-forest-950 text-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] lg:block">
          <div className="absolute inset-0">
            <Image
              src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Luxury house"
              fill
              className="object-cover object-center opacity-35"
              sizes="50vw"
              priority={false}
            />
          </div>
          <div className="relative flex h-full min-h-[560px] flex-col justify-end bg-gradient-to-t from-forest-950 via-forest-950/90 to-transparent p-8">
            <div className="max-w-md rounded-sm border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Private access</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight">Qaiser Land Estates</h1>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Premium owner login for land management, testimonials, inquiries, and deal tracking.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Land only", "Secure login", "Fast updates", "Mobile ready"].map((item) => (
                  <div key={item} className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/80">
                    <BadgeCheck className="h-4 w-4 text-gold-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative overflow-hidden rounded-sm border border-forest-900/10 bg-white/90 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:p-8"
        >
          <div className="absolute inset-0 lg:hidden">
            <Image
              src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Luxury house background"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/65 to-white/80" />
          </div>

          <div className="relative z-10 text-white lg:text-forest-950">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-forest-950 text-white">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold-300">Sign in</p>
              <h2 className="font-serif text-3xl text-white lg:text-forest-950">Admin access</h2>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/85 lg:text-foreground/55">
                Email or phone
              </span>
              <input
                {...form.register("identifier")}
                className="w-full rounded-sm border border-forest-900/15 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-forest-900"
                placeholder="Email or phone"
              />
              {form.formState.errors.identifier ? (
                <p className="text-xs text-red-500">{form.formState.errors.identifier.message}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/85 lg:text-foreground/55">
                Password
              </span>
              <div className="flex gap-3">
                <input
                  {...form.register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-sm border border-forest-900/15 bg-white px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-forest-900"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="inline-flex items-center justify-center rounded-sm border border-forest-900/15 bg-white px-4 text-forest-950 transition hover:bg-forest-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              ) : null}
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">Invalid admin credentials.</p> : null}

          <div className="mt-4">
            <Link
              href="/forgot-password"
              className="text-sm text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white lg:text-forest-950 lg:decoration-forest-950/30 lg:hover:decoration-forest-950"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-sm bg-forest-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/20 lg:border-forest-900/15 lg:bg-transparent lg:text-forest-950 lg:hover:bg-forest-50"
            >
              Back to site
            </Link>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
