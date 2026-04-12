import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

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

  return <Stack screenOptions={{ headerShown: false }} />;
}
