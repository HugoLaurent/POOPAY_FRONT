import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

type Props = { autoStart?: boolean };

export default function FlappyTurd({ autoStart }: Props) {
  const initialWidth = Math.min(360, Dimensions.get("window").width - 48);
  const initialHeight = Math.floor((initialWidth * 9) / 16) || 300;
  const [gameSize, setGameSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const { width, height } = gameSize;
  const BIRD_SIZE = 26;
  const GRAVITY = 0.6;
  const FLAP_VELOCITY = -8;
  const PIPE_WIDTH = 52;
  const GAP_SIZE = 120;
  const [birdY, setBirdY] = useState(height / 2);
  const birdYRef = useRef(birdY);
  const velRef = useRef(0);
  const pipesRef = useRef<{ x: number; gapTop: number; passed?: boolean }[]>(
    []
  );
  const [pipes, setPipes] = useState(pipesRef.current);
  const intervalRef = useRef<number | null>(null);
  const [running, setRunning] = useState<boolean>(!!autoStart);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const resetGame = useCallback(() => {
    velRef.current = 0;
    setBirdY(height / 2);
    birdYRef.current = height / 2;
    pipesRef.current = [
      { x: width + 40, gapTop: Math.max(40, Math.floor(height * 0.2)) },
      {
        x: width + 40 + Math.max(180, width),
        gapTop: Math.max(40, Math.floor(height * 0.35)),
      },
    ];
    setPipes([...pipesRef.current]);
    setScore(0);
    setGameOver(false);
    setRunning(!!autoStart);
  }, [width, height, autoStart]);

  useEffect(() => {
    resetGame();
    return () => {
      if (intervalRef.current)
        clearInterval(intervalRef.current as unknown as number);
    };
  }, [resetGame]);

  useEffect(() => {
    if (autoStart) setRunning(true);
  }, [autoStart]);

  useEffect(() => {
    if (running && !gameOver) {
      intervalRef.current = setInterval(() => {
        velRef.current += GRAVITY;
        setBirdY((y) => {
          const ny = y + velRef.current;
          const clamped = Math.max(0, Math.min(height, ny));
          birdYRef.current = clamped;
          return clamped;
        });

        pipesRef.current = pipesRef.current.map((p) => ({ ...p, x: p.x - 3 }));

        if (pipesRef.current.length && pipesRef.current[0].x < -PIPE_WIDTH) {
          pipesRef.current.shift();
          const nextX =
            (pipesRef.current[pipesRef.current.length - 1]?.x ?? width) +
            Math.max(180, width);
          const gapTop = Math.max(
            30,
            40 + Math.floor(Math.random() * Math.max(1, height - GAP_SIZE - 80))
          );
          pipesRef.current.push({ x: nextX, gapTop, passed: false });
        }

        pipesRef.current.forEach((p) => {
          const birdX = width * 0.25;
          if (!p.passed && p.x + PIPE_WIDTH < birdX) {
            p.passed = true;
            setScore((s) => s + 1);
          }
          const birdTop = birdYRef.current;
          const birdBottom = birdYRef.current + BIRD_SIZE;
          const pipeLeft = p.x;
          const pipeRight = p.x + PIPE_WIDTH;
          const gapTop = p.gapTop;
          const gapBottom = p.gapTop + GAP_SIZE;

          if (birdX + BIRD_SIZE > pipeLeft && birdX < pipeRight) {
            if (birdTop < gapTop || birdBottom > gapBottom) {
              setGameOver(true);
              setRunning(false);
            }
          }
        });

        setPipes([...pipesRef.current]);
      }, 16) as unknown as number;
    }
    return () => {
      if (intervalRef.current)
        clearInterval(intervalRef.current as unknown as number);
      intervalRef.current = null;
    };
  }, [running, gameOver, width, height]);

  const flap = () => {
    if (gameOver) {
      resetGame();
      setRunning(true);
      return;
    }
    velRef.current = FLAP_VELOCITY;
    setRunning(true);
  };

  useEffect(() => {
    if (birdY <= 0 || birdY + BIRD_SIZE >= height) {
      setGameOver(true);
      setRunning(false);
    }
  }, [birdY, height]);

  const onLayout = (e: any) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (w && h && (w !== width || h !== height))
      setGameSize({ width: w, height: h });
  };

  useEffect(() => resetGame(), [width, height, resetGame]);

  // Toilet theme colors
  const bgColor = "#f6fdff"; // tile-like light aqua
  const playAreaBg = "#ffffff"; // porcelain
  const birdColor = "#8fbfe6";
  const pipeColor = "#b3d6e8";

  return (
    <Pressable
      onPress={flap}
      style={[styles.flappyContainer, { flex: 1, backgroundColor: bgColor }]}
      onLayout={onLayout}
    >
      <View
        style={[
          styles.flappyInner,
          { width, height, backgroundColor: playAreaBg },
        ]}
      >
        <View style={styles.scoreWrap} pointerEvents="none">
          <Text style={[styles.scoreText, { color: "#0b5f8a" }]}>{score}</Text>
          {gameOver && (
            <Text style={[styles.gameOverText, { color: "#b00" }]}>
              Game Over - Tap to restart
            </Text>
          )}
        </View>

        <View
          style={{
            position: "absolute",
            left: width * 0.25,
            top: birdY,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            borderRadius: BIRD_SIZE / 2,
            backgroundColor: birdColor,
            borderWidth: 2,
            borderColor: "#d3eefc",
          }}
        />

        {pipes.map((p, i) => (
          <View key={`pipe-${i}`}>
            <View
              style={{
                position: "absolute",
                left: p.x,
                top: 0,
                width: PIPE_WIDTH,
                height: p.gapTop,
                backgroundColor: pipeColor,
                borderRadius: 6,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: p.x,
                top: p.gapTop + GAP_SIZE,
                width: PIPE_WIDTH,
                height: height - (p.gapTop + GAP_SIZE),
                backgroundColor: pipeColor,
                borderRadius: 6,
              }}
            />
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flappyContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: Math.round(Dimensions.get("window").height * 0.25),
    maxHeight: Math.round(Dimensions.get("window").height * 0.7),
  },
  flappyInner: { position: "relative" },
  scoreWrap: { position: "absolute", top: 8, left: 8, zIndex: 10 },
  scoreText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  gameOverText: { color: "#f8d7da", fontSize: 12, marginTop: 4 },
});
