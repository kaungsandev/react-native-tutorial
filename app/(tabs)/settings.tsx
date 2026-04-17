import images from "@/constants/images";
import "@/global.css";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/sign-in");
          } catch (error) {
            console.error("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.fullName || "User"}
              </Text>
              <Text style={styles.userEmail}>
                {user?.primaryEmailAddress?.emailAddress || "No email"}
              </Text>
            </View>
          </View>

          <View style={styles.userDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account ID</Text>
              <Text style={styles.detailValue}>{user?.id || "N/A"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Joined</Text>
              <Text style={styles.detailValue}>
                {user?.createdAt
                  ? formatDate(user.createdAt.toString())
                  : "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email Verified</Text>
              <Text style={styles.detailValue}>
                {user?.primaryEmailAddress?.verification?.status === "verified"
                  ? "Yes"
                  : "No"}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Pressable
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed,
            ]}
            onPress={() => {
              // TODO: Implement account settings
              Alert.alert(
                "Coming Soon",
                "Account settings will be available soon.",
              );
            }}
          >
            <Text style={styles.settingItemText}>Account Settings</Text>
            <Text style={styles.settingItemArrow}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed,
            ]}
            onPress={() => {
              // TODO: Implement notifications
              Alert.alert(
                "Coming Soon",
                "Notification settings will be available soon.",
              );
            }}
          >
            <Text style={styles.settingItemText}>Notifications</Text>
            <Text style={styles.settingItemArrow}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.settingItemPressed,
            ]}
            onPress={() => {
              // TODO: Implement privacy
              Alert.alert(
                "Coming Soon",
                "Privacy settings will be available soon.",
              );
            }}
          >
            <Text style={styles.settingItemText}>Privacy & Security</Text>
            <Text style={styles.settingItemArrow}>›</Text>
          </Pressable>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutButtonPressed,
            ]}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const colors = {
  background: "#fff9e3",
  foreground: "#081126",
  card: "#fff8e7",
  muted: "#f6eecf",
  secondary: "rgba(8, 17, 38, 0.6)",
  accent: "#ea7a53",
  border: "rgba(0, 0, 0, 0.1)",
  success: "#16a34a",
  destructive: "#dc2626",
};

const styles = {
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: colors.background,
  } as const,
  header: {
    marginBottom: 32,
  } as const,
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.foreground,
    textAlign: "left",
    fontFamily: "sans-bold",
  } as const,
  profileSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  } as const,
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  } as const,
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  } as const,
  profileInfo: {
    flex: 1,
  } as const,
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 4,
    fontFamily: "sans-semibold",
  } as const,
  userEmail: {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: "sans-regular",
  } as const,
  userDetails: {
    gap: 16,
  } as const,
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as const,
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
    fontFamily: "sans-semibold",
  } as const,
  detailValue: {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: "sans-regular",
  } as const,
  settingsSection: {
    marginBottom: 24,
  } as const,
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 16,
    fontFamily: "sans-semibold",
  } as const,
  settingItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  } as const,
  settingItemPressed: {
    opacity: 0.8,
  } as const,
  settingItemText: {
    fontSize: 16,
    color: colors.foreground,
    fontFamily: "sans-regular",
  } as const,
  settingItemArrow: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: "300",
  } as const,
  signOutSection: {
    marginTop: 20,
  } as const,
  signOutButton: {
    backgroundColor: colors.destructive,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  } as const,
  signOutButtonPressed: {
    opacity: 0.8,
  } as const,
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "sans-semibold",
  } as const,
};

export default Settings;
