import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ProgressIndicatorProps {
  currentIndex: number;
  totalCards: number;
}

export default function ProgressIndicator({ currentIndex, totalCards }: ProgressIndicatorProps) {
  return (
    <Text style={styles.text}>
      Card {currentIndex + 1} of {totalCards}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#8888AA',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
});