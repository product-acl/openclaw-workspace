import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PartyCard } from '@/types/card';
import CardTypeBadge from './CardTypeBadge';

interface CardDisplayProps {
  card: PartyCard;
  drinkingMode: boolean;
}

const CARD_TYPE_COLORS: Record<PartyCard['type'], string> = {
  dare: '#FF4D4D',
  truth_bomb: '#4D9FFF',
  vote: '#B44DFF',
  challenge_roulette: '#4DFF91',
  wild: '#FFB84D',
  spicy: '#FF4D9E',
};

// 10% opacity versions for overlay
const CARD_TYPE_OVERLAY_COLORS: Record<PartyCard['type'], string> = {
  dare: 'rgba(255, 77, 77, 0.1)',
  truth_bomb: 'rgba(77, 159, 255, 0.1)',
  vote: 'rgba(180, 77, 255, 0.1)',
  challenge_roulette: 'rgba(77, 255, 145, 0.1)',
  wild: 'rgba(255, 184, 77, 0.1)',
  spicy: 'rgba(255, 77, 158, 0.1)',
};

export default function CardDisplay({ card, drinkingMode }: CardDisplayProps) {
  const overlayColor = CARD_TYPE_OVERLAY_COLORS[card.type];
  
  return (
    <View style={styles.card}>
      <View style={[styles.colorOverlay, { backgroundColor: overlayColor }]} />
      <View style={styles.content}>
        <CardTypeBadge type={card.type} />
        <Text style={styles.cardText}>
          {drinkingMode ? card.drinkingText : card.nonDrinkingText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C30',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  colorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    lineHeight: 32,
  },
});