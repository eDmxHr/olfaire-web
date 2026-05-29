"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = { email: string };

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async ({ email }: FormValues) => {
    const token = turnstileToken;

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list. Lumi will be in touch.");
        reset();
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        turnstileRef.current?.reset();
        setTurnstileToken(null);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="w-2 h-2 rounded-full bg-amber flex-shrink-0" />
        <p className="serif text-lg font-light italic text-ink">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          disabled={isSubmitting}
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email address.",
            },
          })}
        />
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Joining..." : "Join waitlist"}
        </Button>
      </div>

      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        options={{ size: "invisible" }}
        onSuccess={(token) => setTurnstileToken(token)}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
      />

      {(errors.email || status === "error") && (
        <p className="mt-2 text-xs text-red pl-2">
          {errors.email?.message ?? message}
        </p>
      )}

      <p className="mt-3 text-xs text-ash pl-2">
        No spam. Early access when Olfaire launches.
      </p>
    </form>
  );
}
