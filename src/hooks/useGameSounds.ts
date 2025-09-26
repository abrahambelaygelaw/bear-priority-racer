// Custom hook for game sound effects using Web Audio API

interface GameSounds {
  playSelect: () => void;
  playRaceStart: () => void;
  playWin: () => void;
  playLose: () => void;
  playComplete: () => void;
}

export const useGameSounds = (): GameSounds => {
  // Create audio context
  const getAudioContext = () => {
    if (typeof window !== 'undefined') {
      return new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return null;
  };

  // Generate different tones for sound effects
  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  // Play sequence of tones
  const playSequence = (notes: { frequency: number; duration: number; delay?: number }[]) => {
    notes.forEach((note, index) => {
      const delay = notes.slice(0, index).reduce((sum, n) => sum + (n.delay || 0), 0);
      setTimeout(() => playTone(note.frequency, note.duration), delay);
    });
  };

  return {
    // Card selection sound - quick beep
    playSelect: () => playTone(800, 0.1, 'triangle'),
    
    // Race start sound - exciting ascending notes
    playRaceStart: () => playSequence([
      { frequency: 400, duration: 0.2, delay: 0 },
      { frequency: 500, duration: 0.2, delay: 150 },
      { frequency: 600, duration: 0.3, delay: 150 }
    ]),
    
    // Win sound - happy ascending melody
    playWin: () => playSequence([
      { frequency: 523, duration: 0.2, delay: 0 }, // C
      { frequency: 659, duration: 0.2, delay: 200 }, // E  
      { frequency: 784, duration: 0.4, delay: 200 }  // G
    ]),
    
    // Lose sound - gentle descending tone
    playLose: () => playSequence([
      { frequency: 400, duration: 0.3, delay: 0 },
      { frequency: 350, duration: 0.3, delay: 300 }
    ]),
    
    // Game complete sound - victory fanfare
    playComplete: () => playSequence([
      { frequency: 523, duration: 0.15, delay: 0 },   // C
      { frequency: 659, duration: 0.15, delay: 150 }, // E
      { frequency: 784, duration: 0.15, delay: 150 }, // G
      { frequency: 1047, duration: 0.4, delay: 150 }  // C (high)
    ])
  };
};