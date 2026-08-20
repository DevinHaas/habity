import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Habity - Build Better Habits",
    short_name: "Habity",
    description: "Track your daily habits and build a better you",
    start_url: "/",
    display: "standalone",
    background_color: "#F5EFE6",
    theme_color: "#E86A33",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
