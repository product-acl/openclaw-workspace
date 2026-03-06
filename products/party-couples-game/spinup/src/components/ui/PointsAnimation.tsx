import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

interface PointsAnimationProps {
  points: number;
  visible: boolean;
  onAnimationEnd: () => void;
  isFinale?: boolean;
}

export default function PointsAnimation({
  points,
  visible,
  onAnimationEnd,
  isFinale = false,
}: PointsAnimationProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = 1;
      translateY.value = 0;

      // Animate upward and fade out
      opacity.value = withDelay(
        300,
        withTiming(0, { duration: 700 }, (finished) => {
          if (finished) {
            runOnJS(onAnimationEnd)();
          }
        })
      );
      translateY.value = withDelay(300, withTiming(-50, { duration: 700 }));
    } else {
      opacity.value = 0;
      translateY.value = 0;
    }
  }, [visible, onAnimationEnd]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.Text style={styles.text}>
        +{points} pts{isFinale ? ' 🏆 2×' : ''}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#FFD166',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});