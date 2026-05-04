import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.noahdarcy.mymelody",
  appName: "My Melody",
  webDir: "out", // Next.js static export folder
  server: {
    // This allows your phone to talk to your local dev server
    // without hitting "Cleartext" (HTTP) security blocks
    cleartext: true,
    androidScheme: "https",
  },
};

export default config;
