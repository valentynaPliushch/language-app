import { AuthProvider } from "@/context/AuthContext";
import { Slot } from "expo-router";

import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
