import React from "react";
import { Redirect } from "expo-router";

// Root index: redirect to the main tabs layout
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
