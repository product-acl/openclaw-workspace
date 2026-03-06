import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SessionLength } from '@/types/session';
import { useIapStore } from '@/store/iapStore';

interface SessionLengthPickerProps {
  selectedLength: SessionLength;
  onSelect: (length: SessionLength) => void;
  onLockedPress?: () => void;
}

export default function SessionLengthPicker({
  selectedLength,
  onSelect,
  onLockedPress,
}: SessionLengthPickerProps) {
  const { isUnlocked } = useIapStore();

  const options: Array<{
    length: SessionLength;
    label: string;
    description: string;
    isLocked: boolean;
  }> = [
    {
      length: 'short',
      label: 'Short',
      description: '20 cards',
      isLocked: false,
    },
    {
      length: 'medium',
      label: 'Medium',
      description: '35 cards',
      isLocked: false,
    },
    {
      length: 'long',
      label: 'Long',
      description: '55 cards 🔒',
      isLocked: !isUnlocked,
    },
  ];

  const handlePress = (option: typeof options[0]) => {
    if (option.isLocked) {
      onLockedPress?.();
    } else {
      onSelect(option.length);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Session Length</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedLength === option.length;
          return (
            <TouchableOpacity
              key={option.length}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
                option.isLocked && styles.optionCardLocked,
              ]}
              onPress={() => handlePress(option)}
              disabled={option.isLocked && !onLockedPress}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                  option.isLocked && styles.optionLabelLocked,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  isSelected && styles.optionDescriptionSelected,
                  option.isLocked && styles.optionDescriptionLocked,
                ]}
              >
                {option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32, // space-8
  },
  label: {
    fontSize: 18, // type-h4
    fontWeight: '600',
    color: '#FFFFFF', // party-text-primary
    marginBottom: 16, // space-4
    fontFamily: 'Poppins_600SemiBold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#1C1C30', // party-surface
    borderRadius: 12, // radius-md
    padding: 16, // space-4
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E2E4A', // party-border
  },
  optionCardSelected: {
    backgroundColor: '#1C1C30', // party-surface
    borderColor: '#7C3AFF', // party-primary
    borderWidth: 2,
  },
  optionCardLocked: {
    opacity: 0.7,
  },
  optionLabel: {
    fontSize: 16, // type-body
    fontWeight: '600',
    color: '#A0A0C0', // party-text-secondary
    marginBottom: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  optionLabelSelected: {
    color: '#FFFFFF', // party-text-primary
  },
  optionLabelLocked: {
    color: '#4A4A6A', // party-text-disabled
  },
  optionDescription: {
    fontSize: 14, // type-body-sm
    color: '#7A7A94', // neutral-400
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  optionDescriptionSelected: {
    color: '#7C3AFF', // party-primary
  },
  optionDescriptionLocked: {
    color: '#4A4A6A', // party-text-disabled
  },
});