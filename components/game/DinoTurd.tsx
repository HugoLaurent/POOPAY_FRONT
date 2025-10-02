import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

type Props = { autoStart?: boolean };

export default function DinoTurd({ autoStart }: Props) {
  // Match FlappyTurd sizing: responsive width/height (16:9 fallback)
  const initialWidth = Math.min(360, Dimensions.get("window").width - 48);
  const initialHeight = Math.floor((initialWidth * 9) / 16) || 300;
  const [gameSize, setGameSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const { width, height } = gameSize;

  // Dino sizing relative to game height
  const DINO_SIZE = Math.round(Math.min(48, height * 0.18));
  const GROUND_PADDING = 10;

  // Physics: y is offset above ground. Positive jumpVel moves dino up, gravity is negative.
  const gravity = -0.8;
  const jumpVel = 12;
  const [dinoY, setDinoY] = useState(0);
  const velRef = useRef(0);
  const [running, setRunning] = useState<boolean>(!!autoStart);
  const [obstacles, setObstacles] = useState<{ x: number }[]>([]);
  const intervalRef = useRef<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => {
    setDinoY(0);
    velRef.current = 0;
    // place obstacles at reasonable distances so they appear on screen
    setObstacles([
      { x: Math.round(width * 0.9) },
      { x: Math.round(width * 1.6) },
    ]);
    setScore(0);
    setGameOver(false);
    setRunning(!!autoStart);
    console.debug("[Dino] reset", { width, DINO_SIZE });
  }, [autoStart, width, DINO_SIZE]);

  useEffect(() => {
    reset();
    return () => {
      if (intervalRef.current)
        clearInterval(intervalRef.current as unknown as number);
    };
  }, [reset]);

  useEffect(() => {
    if (running && !gameOver) {
      intervalRef.current = setInterval(() => {
        velRef.current += gravity;
        setDinoY((y) => Math.max(0, y + velRef.current));
        setObstacles((obs) => {
          const speed = 6;
          const obsWidth = Math.max(24, Math.round(width * 0.06));
          const next = obs
            .map((o) => ({ x: o.x - speed }))
            .filter((o) => o.x > -obsWidth);
          const spacing = Math.max(220, Math.round(width * 0.9));
          const lastX = next[next.length - 1]?.x ?? width;
          // keep at least two obstacles ahead
          if (next.length === 0 || lastX < width - spacing) {
            next.push({ x: lastX + spacing });
          }
          return next;
        });

        setScore((s) => s + 1);
      }, 16) as unknown as number;
    }
    return () => {
      if (intervalRef.current)
        clearInterval(intervalRef.current as unknown as number);
      intervalRef.current = null;
    };
  }, [running, gameOver, width, gravity]);

  // jump handler
  const jump = () => {
    if (gameOver) {
      reset();
      return;
    }
    velRef.current = jumpVel;
    setRunning(true);
  };

  // collision effect (box overlap)
  useEffect(() => {
    const obsWidth = Math.max(24, Math.round(width * 0.06));
    const obsHeight = Math.round(DINO_SIZE * 1.2);
    for (const o of obstacles) {
      const dinoLeft = width * 0.12;
      const dinoRight = dinoLeft + DINO_SIZE;
      const dinoTop = GROUND_PADDING + dinoY;
      const dinoBottom = dinoTop + DINO_SIZE;
      const obsLeft = o.x;
      const obsRight = o.x + obsWidth;
      const obsTop = GROUND_PADDING;
      const obsBottom = obsTop + obsHeight;
      const horizontalOverlap = dinoRight > obsLeft && dinoLeft < obsRight;
      const verticalOverlap = dinoBottom > obsTop && dinoTop < obsBottom;
      if (horizontalOverlap && verticalOverlap) {
        setGameOver(true);
        setRunning(false);
        console.debug("[Dino] collision", {
          o,
          dinoLeft,
          dinoRight,
          dinoTop,
          dinoBottom,
        });
        break;
      }
    }
  }, [obstacles, dinoY, width, DINO_SIZE]);

  const onLayout = (e: any) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (w && h && (w !== width || h !== height))
      setGameSize({ width: w, height: h });
  };

  useEffect(() => {
    // reset game whenever size changes
    reset();
  }, [width, height, reset]);

  // Toilet theme colors
  const bgColor = "#f6fdff"; // very light aqua (tiles)
  const playAreaColor = "#ffffff"; // porcelain white
  const dinoColor = "#8fbfe6"; // pale blue
  const obstacleColor = "#b3d6e8"; // lighter tile
  const scoreColor = "#0b5f8a";

  const obstacleWidth = Math.max(24, Math.round(width * 0.06));

  return (
    <Pressable
      onPress={jump}
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderRadius: 12,
          overflow: "hidden",
          minHeight: Math.round(Dimensions.get("window").height * 0.25),
          maxHeight: Math.round(Dimensions.get("window").height * 0.7),
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
      onLayout={onLayout}
    >
      <View
        style={[
          styles.inner,
          { width, height, backgroundColor: playAreaColor },
        ]}
      >
        <Text style={[styles.score, { color: scoreColor }]}>{score}</Text>

        {/* Dino */}
        <View
          style={{
            position: "absolute",
            left: Math.round(width * 0.25),
            bottom: GROUND_PADDING + dinoY,
            width: DINO_SIZE,
            height: DINO_SIZE,
            borderRadius: 6,
            backgroundColor: dinoColor,
            borderWidth: 2,
            borderColor: "#d3eefc",
          }}
        />

        {/* Obstacles (toilet rolls) */}
        {obstacles.map((o, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: o.x,
              bottom: GROUND_PADDING,
              width: obstacleWidth,
              height: Math.round(DINO_SIZE * 1.2),
              backgroundColor: obstacleColor,
              borderRadius: 6,
            }}
          />
        ))}

        {/* Decorative toilet bowl at right (simple circle) */}
        <View
          style={{
            position: "absolute",
            right: 8,
            bottom: GROUND_PADDING - 6,
            width: 28,
            height: 18,
            borderRadius: 8,
            backgroundColor: "#f8fbff",
            borderWidth: 2,
            borderColor: "#d7eef8",
          }}
        />

        {gameOver && (
          <Text style={[styles.gameOver, { color: "#b00" }]}>
            Game Over - Tap to restart
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  score: { position: "absolute", top: 8, right: 8, fontWeight: "700" },
  gameOver: { position: "absolute", top: 60, alignSelf: "center" },
});
