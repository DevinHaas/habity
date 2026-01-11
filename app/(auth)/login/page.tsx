"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Github, Loader2, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign in");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch {
      setError("Failed to sign in with GitHub");
      setIsGithubLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Card with medieval styling */}
      <div className="relative bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-orange/20">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange via-orange-light to-orange" />
        
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-orange/30 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-orange/30 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange/30 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-orange/30 rounded-br-lg" />

        <div className="p-8 pt-10">
          {/* Logo/Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <div className="relative w-20 h-20">
              <Image
                src="/badges/badge_1.png"
                alt="Habity"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold text-brown mb-2">
              Begin Your Quest
            </h1>
            <p className="text-brown-light text-sm">
              Sign in to continue your journey
            </p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brown font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light" />
                <Input
                  id="email"
                  type="email"
                  placeholder="knight@realm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-cream-dark/50 border-cream-dark focus:border-orange focus:ring-orange/20 text-brown placeholder:text-brown-light/50 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-brown font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-light" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-cream-dark/50 border-cream-dark focus:border-orange focus:ring-orange/20 text-brown placeholder:text-brown-light/50 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light hover:text-brown transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange hover:bg-orange/90 text-white font-semibold rounded-xl h-12 shadow-lg shadow-orange/25 transition-all hover:shadow-orange/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Enter the Realm"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-dark" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-4 text-brown-light">
                or continue with
              </span>
            </div>
          </div>

          {/* GitHub Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGithubLogin}
            disabled={isGithubLoading}
            className="w-full border-2 border-cream-dark hover:border-brown/30 bg-cream-dark/30 hover:bg-cream-dark/50 text-brown font-medium rounded-xl h-12 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGithubLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Github className="h-5 w-5 mr-2" />
                Continue with GitHub
              </>
            )}
          </Button>

          {/* Sign up link */}
          <p className="text-center mt-6 text-sm text-brown-light">
            New to the realm?{" "}
            <Link
              href="/signup"
              className="text-orange font-semibold hover:underline"
            >
              Join the Guild
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
