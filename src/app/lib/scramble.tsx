import React, { useEffect, useState, useRef } from 'react';

type ScrambleQueueItem = {
  from: string;
  to: string;
  startFrame: number;
  endFrame: number;
  tempChar?: string;
};

const phrases = ["lorem ipsum", "uramloneng usamipnung", 'lorem ipsum', 'uguragamlogonegeng ugusagamigipnugung'];
const scrambleChars = "!-_\\/—=+*^?";

const getRandomScrambleChar = (): string =>
  scrambleChars[Math.floor(Math.random() * scrambleChars.length)];

export default function TextScramble() {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const scrambleQueueRef = useRef<ScrambleQueueItem[]>([]);
  const frameCounterRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    startScrambleTransition();

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [phraseIndex]);

  const startScrambleTransition = () => {
    const nextPhrase = phrases[phraseIndex];
    const currentText = displayedText;
    const maxLength = Math.max(currentText.length, nextPhrase.length);

    const queue: ScrambleQueueItem[] = [];

    for (let i = 0; i < maxLength; i++) {
      const fromChar = currentText[i] || '';
      const toChar = nextPhrase[i] || '';
      const startFrame = Math.floor(Math.random() * 40);
      const endFrame = startFrame + Math.floor(Math.random() * 40);

      queue.push({ from: fromChar, to: toChar, startFrame, endFrame });
    }

    scrambleQueueRef.current = queue;
    frameCounterRef.current = 0;

    runScrambleAnimation();
  };

  const runScrambleAnimation = () => {
    const queue = scrambleQueueRef.current;
    const frame = frameCounterRef.current;
    const updatedText: string[] = [];

    let completedChars = 0;

    for (let i = 0; i < queue.length; i++) {
      const { from, to, startFrame, endFrame, tempChar } = queue[i];

      if (frame >= endFrame) {
        completedChars++;
        updatedText.push(to);
      } else if (frame >= startFrame) {
        const newTempChar =
          !tempChar || Math.random() < 0.28 ? getRandomScrambleChar() : tempChar;
        queue[i].tempChar = newTempChar;
        updatedText.push(newTempChar);
      } else {
        updatedText.push(from);
      }
    }

    setDisplayedText(updatedText);

    if (completedChars === queue.length) {
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 2000);
    } else {
      frameCounterRef.current++;
      animationFrameIdRef.current = requestAnimationFrame(runScrambleAnimation);
    }
  };

  return (
    <h3>
      {displayedText.map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </h3>
  );
}
