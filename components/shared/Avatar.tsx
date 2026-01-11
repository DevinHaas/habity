"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function Avatar({ src, alt = "User", size = "md", className }: AvatarProps) {
  // Default avatar with emoji
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-orange-light text-2xl",
          sizeClasses[size],
          className
        )}
      >
        🐯
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
