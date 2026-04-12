import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
      <Link href="/sign-in" className="text-blue-500">
        Already have an account? Sign in.
      </Link>
    </View>
  );
};

export default SignUp;
