import type { Core } from "@strapi/strapi";
import crypto from "node:crypto";

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const jwtSecret =
    env("JWT_SECRET") ||
    env("ADMIN_JWT_SECRET") ||
    crypto.randomBytes(16).toString("base64");
  return {
    "users-permissions": {
      config: {
        jwtSecret,
      },
    },
  };
};

export default config;
