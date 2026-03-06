import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface UndoButtonProps {
  onPress: () => void;
  visible: boolean;
}

export default function UndoButton({ onPress, visible }: UndoButtonProps) {
  if (!visible) return null;
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>↩ Undo last</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: '#8888AA',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
});