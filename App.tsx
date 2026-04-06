import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import TubeComponent from './src/components/TubeComponent';
import WinModal from './src/components/WinModal';
import {
  Tube,
  GameState,
  generateLevel,
  moveBall,
  canMove,
  checkWin,
  isTubeComplete,
} from './src/utils/gameLogic';

const { width } = Dimensions.get('window');

// Difficulty progression: number of colors per level
const LEVEL_COLORS = [3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10];

function getNumColors(level: number): number {
  return LEVEL_COLORS[Math.min(level - 1, LEVEL_COLORS.length - 1)];
}

export default function App() {
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>(() => ({
    tubes: generateLevel(getNumColors(1)),
    selectedTubeId: null,
    moves: 0,
    won: false,
  }));
  const [history, setHistory] = useState<Tube[][]>([]);

  const handleTubePress = useCallback(
    (tubeId: number) => {
      if (gameState.won) return;

      const { tubes, selectedTubeId } = gameState;

      // Nothing selected — select this tube if it has movable balls
      if (selectedTubeId === null) {
        const tube = tubes.find((t) => t.id === tubeId)!;
        if (tube.balls.length === 0) return;
        if (isTubeComplete(tube)) return;
        setGameState((prev) => ({ ...prev, selectedTubeId: tubeId }));
        return;
      }

      // Tapping same tube — deselect
      if (selectedTubeId === tubeId) {
        setGameState((prev) => ({ ...prev, selectedTubeId: null }));
        return;
      }

      const from = tubes.find((t) => t.id === selectedTubeId)!;
      const to = tubes.find((t) => t.id === tubeId)!;

      if (!canMove(from, to)) {
        // Switch selection to tapped tube if it has balls
        const newTube = tubes.find((t) => t.id === tubeId)!;
        if (newTube.balls.length > 0 && !isTubeComplete(newTube)) {
          setGameState((prev) => ({ ...prev, selectedTubeId: tubeId }));
        } else {
          setGameState((prev) => ({ ...prev, selectedTubeId: null }));
        }
        return;
      }

      // Valid move
      const newTubes = moveBall(tubes, selectedTubeId, tubeId);
      const won = checkWin(newTubes);

      setHistory((prev) => [...prev, tubes]);
      setGameState({
        tubes: newTubes,
        selectedTubeId: null,
        moves: gameState.moves + 1,
        won,
      });
    },
    [gameState]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setGameState((s) => ({
      tubes: prev,
      selectedTubeId: null,
      moves: Math.max(0, s.moves - 1),
      won: false,
    }));
  }, [history]);

  const handleRestart = useCallback(() => {
    setHistory([]);
    setGameState({
      tubes: generateLevel(getNumColors(level)),
      selectedTubeId: null,
      moves: 0,
      won: false,
    });
  }, [level]);

  const handleNextLevel = useCallback(() => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setHistory([]);
    setGameState({
      tubes: generateLevel(getNumColors(nextLevel)),
      selectedTubeId: null,
      moves: 0,
      won: false,
    });
  }, [level]);

  // Layout tubes in rows of up to 5
  const TUBES_PER_ROW = gameState.tubes.length <= 5 ? gameState.tubes.length : 5;
  const rows: Tube[][] = [];
  for (let i = 0; i < gameState.tubes.length; i += TUBES_PER_ROW) {
    rows.push(gameState.tubes.slice(i, i + TUBES_PER_ROW));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1923" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.movesText}>{gameState.moves} moves</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.iconBtn, history.length === 0 && styles.iconBtnDisabled]}
            onPress={handleUndo}
            disabled={history.length === 0}
          >
            <Text style={styles.iconBtnText}>↩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleRestart}>
            <Text style={styles.iconBtnText}>↺</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game area */}
      <ScrollView contentContainerStyle={styles.gameArea}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((tube) => (
              <TubeComponent
                key={tube.id}
                tube={tube}
                isSelected={gameState.selectedTubeId === tube.id}
                onPress={() => handleTubePress(tube.id)}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <Text style={styles.hint}>
        {gameState.selectedTubeId !== null
          ? 'Tap a tube to move the ball'
          : 'Tap a tube to select it'}
      </Text>

      <WinModal
        visible={gameState.won}
        moves={gameState.moves}
        level={level}
        onNextLevel={handleNextLevel}
        onReplay={handleRestart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1923',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  levelText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  movesText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDisabled: {
    opacity: 0.3,
  },
  iconBtnText: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  gameArea: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  hint: {
    textAlign: 'center',
    color: '#556273',
    fontSize: 13,
    paddingBottom: 16,
  },
});
