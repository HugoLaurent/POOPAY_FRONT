import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Simple ChipButton used to toggle between views (e.g. ranking / social).
 * Keeps styling minimal and uses theme colors via useTheme hook in the repo.
 */
export default function ChipButton({
  label,
  selected = false,
  onPress,
  style,
}: Props) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme] || Colors.light;

  const backgroundColor = selected ? colors.groupCardBg : "transparent";
  const borderColor = selected
    ? "rgba(139,69,19,0.18)"
    : "rgba(139,69,19,0.08)";
  const textColor = colors.textDivers || "#000";

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 14,
          marginRight: 8,
          borderWidth: 1,
          borderColor,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <ThemedText
        style={{
          color: textColor,
          fontSize: 13,
          fontWeight: selected ? "700" : "400",
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}
