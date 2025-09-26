import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TaskCard } from './TaskCard';
import { BearRace } from './BearRace';
import { GameResults } from './GameResults';
import { mockAPI } from '@/lib/mockAPI';
import { useGameSounds } from '@/hooks/useGameSounds';

interface Task {
  name: string;
  priority: number;
}

interface GameState {
  currentRound: number;
  totalRounds: number;
  score: number;
  tasks: Task[];
  currentPair: [Task, Task] | null;
  userGuess: Task | null;
  showRace: boolean;
  gameComplete: boolean;
}

export const TaskPriorityGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    totalRounds: 3,
    score: 0,
    tasks: [],
    currentPair: null,
    userGuess: null,
    showRace: false,
    gameComplete: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const sounds = useGameSounds();

  // Initialize game with tasks
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setIsLoading(true);
    try {
      const tasks = await mockAPI.getRandomTasks();
      setGameState(prev => ({
        ...prev,
        tasks,
        currentRound: 1,
        score: 0,
        gameComplete: false,
      }));
      setupNextRound(tasks, 1);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupNextRound = (tasks: Task[], round: number) => {
    if (round > gameState.totalRounds) {
      setGameState(prev => ({ ...prev, gameComplete: true }));
      return;
    }

    // Select two random tasks for comparison
    const shuffled = [...tasks].sort(() => Math.random() - 0.5);
    const currentPair: [Task, Task] = [shuffled[0], shuffled[1]];
    
    setGameState(prev => ({
      ...prev,
      currentPair,
      userGuess: null,
      showRace: false,
    }));
  };

  const handleTaskSelection = (selectedTask: Task) => {
    if (!gameState.currentPair || gameState.userGuess) return;
    
    sounds.playSelect();
    setGameState(prev => ({ ...prev, userGuess: selectedTask }));
    
    // Start bear race animation after a brief delay
    setTimeout(() => {
      sounds.playRaceStart();
      setGameState(prev => ({ ...prev, showRace: true }));
    }, 500);
  };

  const handleRaceComplete = () => {
    if (!gameState.currentPair || !gameState.userGuess) return;

    const [task1, task2] = gameState.currentPair;
    const winner = task1.priority > task2.priority ? task1 : task2;
    const isCorrect = gameState.userGuess === winner;
    
    // Play appropriate sound
    if (isCorrect) {
      sounds.playWin();
    } else {
      sounds.playLose();
    }
    
    const newScore = gameState.score + (isCorrect ? 1 : 0);
    const nextRound = gameState.currentRound + 1;
    
    setGameState(prev => ({
      ...prev,
      score: newScore,
      currentRound: nextRound,
    }));

    // Setup next round after showing results
    setTimeout(() => {
      if (nextRound <= gameState.totalRounds) {
        setupNextRound(gameState.tasks, nextRound);
      } else {
        sounds.playComplete();
        setGameState(prev => ({ ...prev, gameComplete: true }));
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="animate-bounce-in text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-glow animate-glow"></div>
          <p className="text-lg font-semibold text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (gameState.gameComplete) {
    return (
      <GameResults 
        score={gameState.score} 
        totalRounds={gameState.totalRounds}
        onPlayAgain={startNewGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary overflow-hidden">
      {/* Header */}
      <header className="p-4 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Task Priority Challenge
        </h1>
        <div className="flex justify-center space-x-6 text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
            Round {gameState.currentRound}/{gameState.totalRounds}
          </span>
          <span className="px-3 py-1 rounded-full bg-success/10 text-success">
            Score: {gameState.score}
          </span>
        </div>
      </header>

      {/* Game Content */}
      <main className="px-4 pb-20">
        {!gameState.showRace && gameState.currentPair ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">Which task has higher priority?</h2>
              <p className="text-muted-foreground">Choose the task you think is more important</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {gameState.currentPair.map((task, index) => (
                <TaskCard
                  key={index}
                  task={task}
                  isSelected={gameState.userGuess === task}
                  onSelect={() => handleTaskSelection(task)}
                  disabled={!!gameState.userGuess}
                />
              ))}
            </div>
          </div>
        ) : gameState.showRace && gameState.currentPair ? (
          <BearRace
            tasks={gameState.currentPair}
            userGuess={gameState.userGuess}
            onRaceComplete={handleRaceComplete}
          />
        ) : null}
      </main>
    </div>
  );
};