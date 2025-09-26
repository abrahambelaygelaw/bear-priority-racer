import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameResultsProps {
  score: number;
  totalRounds: number;
  onPlayAgain: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({ 
  score, 
  totalRounds, 
  onPlayAgain 
}) => {
  const percentage = Math.round((score / totalRounds) * 100);
  
  const getResultMessage = () => {
    if (percentage >= 100) return { emoji: '🏆', message: 'Perfect Score!', color: 'text-success' };
    if (percentage >= 67) return { emoji: '🎯', message: 'Great Job!', color: 'text-success' };
    if (percentage >= 33) return { emoji: '👍', message: 'Good Try!', color: 'text-warning' };
    return { emoji: '🤔', message: 'Keep Learning!', color: 'text-muted-foreground' };
  };

  const result = getResultMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-card to-card-hover shadow-2xl animate-bounce-in">
        
        {/* Trophy Animation */}
        <div className="text-8xl mb-6 animate-celebration">
          {result.emoji}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Game Complete!
        </h1>

        {/* Score Display */}
        <div className="mb-6">
          <div className="text-6xl font-bold mb-2 text-primary">
            {score}/{totalRounds}
          </div>
          <div className={`text-xl font-semibold ${result.color}`}>
            {result.message}
          </div>
          <div className="text-lg text-muted-foreground">
            {percentage}% Accuracy
          </div>
        </div>

        {/* Performance Message */}
        <div className="mb-8 p-4 bg-muted rounded-2xl">
          <p className="text-muted-foreground">
            {percentage >= 67 
              ? "You have excellent task prioritization skills! 🌟" 
              : "Practice makes perfect! Try again to improve your skills. 💪"
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transform hover:scale-105 transition-all"
            size="lg"
          >
            <span className="text-lg">🎮 Play Again</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Share Results
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-6 text-xs text-muted-foreground">
          💡 Tip: Think about impact, urgency, and deadlines when prioritizing tasks
        </div>
      </Card>
    </div>
  );
};