"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LoginFields {
  email: string;
  password: string;
}

export function AdminLoginForm() {
  const { register, handleSubmit } = useForm<LoginFields>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: LoginFields) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "This account is not authorized.");
      }

      window.location.href = "/content";
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Login failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter email"
          autoComplete="email"
          {...register("email", { required: true })}
        />
        <Input
          type="password"
          placeholder="Enter password"
          autoComplete="current-password"
          {...register("password", { required: true })}
        />
        {error && <p className="text-sm text-red">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}
