import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useSessionStore } from '@/store/sessionStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ExitConfirm'>;

export default function ExitConfirmModal({ navigation }: Props) {
  const { endSession } = useSessionStore();

  const handleEndSession = () => {
    endSession();
    // Reset navigation to Home
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleKeepPlaying = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.heading}>End session?</Text>
        <Text style={styles.body}>Your progress will be lost.</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.endButton]} onPress={handleEndSession}>
            <Text style={styles.endButtonText}>Yes, End</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.keepButton]} onPress={handleKeepPlaying}>
            <Text style={styles.keepButtonText}>Keep Playing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#FF3B30',
  },
  keepButton: {
    backgroundColor: '#007AFF',
  },
  endButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  keepButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});