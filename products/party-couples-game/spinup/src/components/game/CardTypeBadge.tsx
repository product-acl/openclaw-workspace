import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PartyCardType } from '@/types/card';

interface CardTypeBadgeProps {
  type: PartyCardType;
}

const CARD_TYPE_LABELS: Record<PartyCardType, string> = {
  dare: 'DARE',
  truth_bomb: 'TRUTH BOMB',
  vote: 'VOTE',
  challenge_roulette: 'CHALLENGE',
  wild: 'WILD',
  spicy: 'SPICY',
};

const CARD_TYPE_COLORS: Record<PartyCardType, string> = {
  dare: '#FF4D4D',
  truth_bomb: '#4D9FFF',
  vote: '#B44DFF',
  challenge_roulette: '#4DFF91',
  wild: '#FFB84D',
  spicy: '#FF4D9E',
};

export default function CardTypeBadge({ type }: CardTypeBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: CARD_TYPE_COLORS[type] }]}>
      <Text style={styles.text}>{CARD_TYPE_LABELS[type]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
});