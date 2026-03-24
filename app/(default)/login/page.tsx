"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProviderSignInButtons } from "@/components/auth/provider-sign-in-buttons";
import { BackgroundMap } from "@/components/map/background-map";

const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handlePreviewLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid username or password.");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative h-[100svh] overflow-hidden">
      <BackgroundMap />

      <section className="relative z-10 mx-auto flex `min-h-svh max-w-md items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-white/10 bg-background/90 p-6 shadow-2xl backdrop-blur-md">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access protected features.
          </p>

          <div className="mt-6 space-y-4">
            <ProviderSignInButtons />

            {isPreview ? (
              <form
                onSubmit={handlePreviewLogin}
                className="space-y-3 rounded-xl border p-4"
              >
                <p className="text-sm font-medium">Preview test login</p>

                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                {error ? <p className="text-sm text-red-500">{error}</p> : null}

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in with preview user"}
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
