import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server:
    (process.env.POLAR_SERVER as "sandbox" | "production") ?? "production",
});

export const POLAR_PRODUCT_IDS = {
  pro: process.env.POLAR_PRO_PRODUCT_ID!,
} as const;

export type PolarProductKey = keyof typeof POLAR_PRODUCT_IDS;
