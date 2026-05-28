"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = { email: string };

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async ({ email }: FormValues) => {
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list. Lumi will be in touch.");
        reset();
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 py-4">
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
