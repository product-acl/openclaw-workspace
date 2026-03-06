import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '@/types/session';

interface ScoreDisplayProps {
  players: Player[];
}

export default function ScoreDisplay({ players }: ScoreDisplayProps) {
  if (players.length < 2) return null;

  return (
    <View style={styles.container}>
      <View style={styles.scoreItem}>
        <Text style={styles.playerName}>{players[0].name}</Text>
        <Text style={styles.score}>{players[0].score} pts</Text>
      </View>
      
      <Text style={styles.separator}>|</Text>
      
      <View style={styles.scoreItem}>
        <Text style={styles.playerName}>{players[1].name}</Text>
        <Text style={styles.score}>{players[1].score} pts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C30',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2E2E4A',
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  score: {
    fontSize: 24,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#FFD166',
  },
  separator: {
    fontSize: 20,
    color: '#2E2E4A',
    marginHorizontal: 16,
  },
});