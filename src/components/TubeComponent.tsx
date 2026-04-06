import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Tube, isTubeComplete, TUBE_CAPACITY } from '../utils/gameLogic';

const { width } = Dimensions.get('window');

interface Props {
  tube: Tube;
  isSelected: boolean;
  onPress: () => void;
}

export default function TubeComponent({ tube, isSelected, onPress }: Props) {
  const isComplete = isTubeComplete(tube);

  // Render balls bottom-up (index 0 is bottom)
  const slots = Array.from({ length: TUBE_CAPACITY }, (_, i) => {
    const ballIndex = i; // slot 0 = bottom
    const ball = tube.balls[ballIndex] ?? null;
    return ball;
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tubeWrapper,
        isSelected && styles.selectedWrapper,
        isComplete && styles.completeWrapper,
      ]}
      activeOpacity={0.8}
    >
      <View style={[styles.tube, isSelected && styles.tubeSelected]}>
        {/* Render slots bottom to top, visually top to bottom */}
        {[...slots].reverse().map((color, idx) => (
          <View
            key={idx}
            style={[
              styles.ballSlot,
              idx < TUBE_CAPACITY - 1 && styles.ballSlotBorder,
            ]}
          >
            {color ? (
              <View
                style={[
                  styles.ball,
                  { backgroundColor: color },
                  isSelected &&
                    idx === 0 &&
                    tube.balls.length > 0 &&
                    styles.selectedBall,
                ]}
              />
            ) : (
              <View style={styles.emptySlot} />
            )}
          </View>
        ))}
      </View>
      {/* Tube base */}
      <View style={[styles.tubeBase, isComplete && styles.completeBase]} />
    </TouchableOpacity>
  );
}

const TUBE_WIDTH = Math.min(54, width / 8);
const BALL_SIZE = TUBE_WIDTH - 8;

const styles = StyleSheet.create({
  tubeWrapper: {
    alignItems: 'center',
    margin: 6,
    paddingTop: 12,
  },
  selectedWrapper: {
    transform: [{ translateY: -12 }],
  },
  completeWrapper: {
    opacity: 0.85,
  },
  tube: {
    width: TUBE_WIDTH,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#BDC3C7',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  tubeSelected: {
    borderColor: '#F1C40F',
    borderWidth: 3,
  },
  ballSlot: {
    width: TUBE_WIDTH - 6,
    height: TUBE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  ballSlotBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  selectedBall: {
    shadowColor: '#F1C40F',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
  emptySlot: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
  },
  tubeBase: {
    width: TUBE_WIDTH + 6,
    height: 10,
    backgroundColor: '#BDC3C7',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  completeBase: {
    backgroundColor: '#2ECC71',
  },
});
