import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CountdownTimerProps {
  durationSeconds: number;
  onExpire: () => void;
  isActive: boolean;
}

export default function CountdownTimer({
  durationSeconds,
  onExpire,
  isActive,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Reset timer when duration changes or becomes active
    setTimeLeft(durationSeconds);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [durationSeconds, isActive, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const isWarning = timeLeft <= 10;
  const isExpired = timeLeft === 0;

  return (
    <View style={styles.container}>
      {isExpired ? (
        <Text style={[styles.timerText, styles.expiredText]}>⏰ Time's up!</Text>
      ) : (
        <Text style={[
          styles.timerText,
          isWarning && styles.warningText,
        ]}>
          {formattedTime}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  timerText: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#FFFFFF',
  },
  warningText: {
    color: '#FFD166',
  },
  expiredText: {
    color: '#FF4D4D',
  },
});