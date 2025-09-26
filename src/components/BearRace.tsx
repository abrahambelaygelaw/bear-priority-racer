import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Task {
  name: string;
  priority: number;
}

interface BearRaceProps {
  tasks: [Task, Task];
  userGuess: Task | null;
  onRaceComplete: () => void;
}

export const BearRace: React.FC<BearRaceProps> = ({ 
  tasks, 
  userGuess, 
  onRaceComplete 
}) => {
  const [raceStarted, setRaceStarted] = useState(false);
  const [winner, setWinner] = useState<Task | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Start race animation
    const startTimer = setTimeout(() => {
      setRaceStarted(true);
    }, 500);

    // Determine winner and show result
    const raceTimer = setTimeout(() => {
      const [task1, task2] = tasks;
      const raceWinner = task1.priority > task2.priority ? task1 : task2;
      setWinner(raceWinner);
      setShowResult(true);
    }, 2500);

    // Complete race
    const completeTimer = setTimeout(() => {
      onRaceComplete();
    }, 4500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(raceTimer);
      clearTimeout(completeTimer);
    };
  }, [tasks, onRaceComplete]);

  const isCorrectGuess = userGuess && winner && userGuess === winner;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Race Track */}
      <div className="relative min-h-[500px] bg-gradient-to-t from-green-100 to-blue-100 rounded-3xl overflow-hidden border-4 border-primary/20">
        
        {/* Finish Line */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-warning to-accent flex items-center justify-center">
          <span className="text-2xl font-bold text-white">🏁 FINISH LINE 🏁</span>
        </div>

        {/* Bears */}
        <div className="absolute bottom-0 left-0 right-0 h-full flex">
          {/* Bear 1 */}
          <div className="flex-1 relative">
            <div 
              className={cn(
                "absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-2000",
                raceStarted && winner === tasks[0] && "animate-bear-race",
                raceStarted && winner !== tasks[0] && "translate-y-[-60vh]"
              )}
            >
              <div className="text-center">
                <div className="text-6xl animate-bear-legs">🐻</div>
                <div className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  {tasks[0].name}
                </div>
              </div>
            </div>
          </div>

          {/* Bear 2 */}
          <div className="flex-1 relative">
            <div 
              className={cn(
                "absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-2000",
                raceStarted && winner === tasks[1] && "animate-bear-race",
                raceStarted && winner !== tasks[1] && "translate-y-[-60vh]"
              )}
            >
              <div className="text-center">
                <div className="text-6xl animate-bear-legs">🐻</div>
                <div className="mt-2 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                  {tasks[1].name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        {showResult && winner && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-bounce-in">
            <div className="text-center p-8 bg-white rounded-3xl shadow-2xl">
              <div className="text-6xl mb-4 animate-celebration">
                {isCorrectGuess ? '🎉' : '😅'}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {winner.name} Wins!
              </h2>
              <p className="text-lg mb-4">
                Priority Score: {winner.priority}
              </p>
              <div className={cn(
                "text-xl font-semibold",
                isCorrectGuess ? "text-success" : "text-warning"
              )}>
                {isCorrectGuess ? "Correct! 🎯" : "Not quite! 🤔"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Your Guess Display */}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold mb-2">Your Guess:</p>
        <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full">
          {userGuess?.name || "None"}
        </span>
      </div>
    </div>
  );
};