import { Capacitor } from "@capacitor/core";

const WEB_ENVIRONMENTS = {
  DEV: "development",
  PROD: "production"
};

const baseURLS = {
  LOCAL: "http://localhost:3000",
  PROD: "https://xplat-hwatu-web.vercel.app"
};

const apiBaseURL = Capacitor.isNativePlatform()
  ? baseURLS.PROD
  : process.env.NODE_ENV === WEB_ENVIRONMENTS.DEV
  ? baseURLS.LOCAL
  : baseURLS.PROD;

export { WEB_ENVIRONMENTS, baseURLS, apiBaseURL };
