import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Clerk Publishable Key. Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file.",
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    "sans-medium": require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
    "sans-bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    "sans-extrabold": require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/BeVietnamPro-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  );
}
