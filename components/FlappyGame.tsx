import React from "react";
import FlappyTurd from "@/components/game/FlappyTurd";

// Thin compatibility wrapper: keep the original import path `@/components/FlappyGame`
// while delegating to the single implementation `FlappyTurd`.
export default function FlappyGame() {
  return <FlappyTurd autoStart={false} />;
}
