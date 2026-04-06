import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';

interface Props {
  visible: boolean;
  moves: number;
  level: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

export default function WinModal({
  visible,
  moves,
  level,
  onNextLevel,
  onReplay,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Sorted!</Text>
          <Text style={styles.subtitle}>
            Level {level} complete in {moves} {moves === 1 ? 'move' : 'moves'}
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onNextLevel}>
            <Text style={styles.primaryBtnText}>Next Level →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onReplay}>
            <Text style={styles.secondaryBtnText}>Replay</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1E2D40',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F1C40F',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#BDC3C7',
    marginBottom: 28,
  },
  primaryBtn: {
    backgroundColor: '#3498DB',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 10,
  },
  secondaryBtnText: {
    color: '#7F8C8D',
    fontSize: 15,
  },
});
