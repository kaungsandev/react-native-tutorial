import images from "@/constants/images";
import "@/global.css";
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"signup" | "verify">("signup");

  const isLoading = fetchStatus === "fetching";

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });

    if (error) {
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as any);
          }
        },
      });
    } else if (signUp.status === "missing_requirements") {
      await signUp.verifications.sendEmailCode();
      setStep("verify");
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as any);
          }
        },
      });
    }
  };

  const handleResendCode = async () => {
    await signUp.verifications.sendEmailCode();
  };

  const handleReset = () => {
    signUp.reset();
    setStep("signup");
    setCode("");
  };

  if (step === "verify") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image source={images.logo} style={styles.logo} />
          </View>

          <Text style={styles.title}>Verify your account</Text>
          <Text style={styles.subtitle}>
            Enter the verification code sent to your email
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={[styles.input, errors.fields.code && styles.inputError]}
                value={code}
                placeholder="Enter 6-digit code"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                onChangeText={setCode}
                keyboardType="numeric"
                autoCapitalize="none"
                maxLength={6}
              />
              {errors.fields.code && (
                <Text style={styles.errorText}>
                  {errors.fields.code.message}
                </Text>
              )}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                (!code || isLoading) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleVerify}
              disabled={!code || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleResendCode}
            >
              <Text style={styles.secondaryButtonText}>Resend code</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleReset}
            >
              <Text style={styles.secondaryButtonText}>Start over</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image source={images.logo} style={styles.logo} />
        </View>

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Sign up to manage your subscriptions
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                errors.fields.emailAddress && styles.inputError,
              ]}
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.fields.emailAddress && (
              <Text style={styles.errorText}>
                {errors.fields.emailAddress.message}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                errors.fields.password && styles.inputError,
              ]}
              value={password}
              placeholder="Enter your password"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.fields.password && (
              <Text style={styles.errorText}>
                {errors.fields.password.message}
              </Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!emailAddress || !password || isLoading) &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable>
                <Text style={styles.linkText}>Sign in</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: colors.background,
  } as const,
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  } as const,
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  } as const,
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "sans-bold",
  } as const,
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 32,
    textAlign: "center",
    fontFamily: "sans-regular",
  } as const,
  form: {
    gap: 20,
  } as const,
  inputContainer: {
    gap: 8,
  } as const,
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
    fontFamily: "sans-semibold",
  } as const,
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: "sans-regular",
  } as const,
  inputError: {
    borderColor: colors.destructive,
  } as const,
  errorText: {
    fontSize: 12,
    color: colors.destructive,
    marginTop: -4,
    fontFamily: "sans-regular",
  } as const,
  button: {
    backgroundColor: colors.foreground,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  } as const,
  buttonPressed: {
    opacity: 0.8,
  } as const,
  buttonDisabled: {
    opacity: 0.5,
  } as const,
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "sans-semibold",
  } as const,
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  } as const,
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "sans-semibold",
  } as const,
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
  } as const,
  footerText: {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: "sans-regular",
  } as const,
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accent,
    fontFamily: "sans-semibold",
  } as const,
};

export default SignUp;
