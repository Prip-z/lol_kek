import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { fetchTodayWordleSolution } from './wordleApi';

type LetterState = 'correct' | 'present' | 'absent';

function evaluateGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent');
  const targetChars = target.split('');
  const used = Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetChars[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;
    const foundIdx = targetChars.findIndex(
      (ch, idx) => !used[idx] && ch === guess[i]
    );
    if (foundIdx !== -1) {
      result[i] = 'present';
      used[foundIdx] = true;
    }
  }

  return result;
}

export function WordleGate({ children }: { children: ReactNode }) {
  const todayKey = `wordle_passed_${new Date().toISOString().slice(0, 10)}`;
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(todayKey) === '1'
  );
  const [solution, setSolution] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (unlocked) return;
    fetchTodayWordleSolution().then(({ word, isLive }) => {
      setSolution(word);
      setIsLive(isLive);
    });
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!solution) return;
    const word = currentInput.trim().toUpperCase();
    if (!/^[A-Z]{5}$/.test(word)) return;

    const nextGuesses = [...guesses, word];
    setGuesses(nextGuesses);
    setCurrentInput('');

    if (word === solution) {
      sessionStorage.setItem(todayKey, '1');
      setUnlocked(true);
    } else if (nextGuesses.length >= 6) {
      setTimeout(() => setGuesses([]), 1200);
    }
  };

  const badgeStyle: Record<LetterState, string> = {
    correct: 'bg-emerald-600 border-emerald-500 text-white',
    present: 'bg-amber-500 border-amber-400 text-black',
    absent: 'bg-zinc-700 border-zinc-600 text-zinc-300',
  };

  return (
    <div className="bg-laba flex-1 min-h-screen text-white flex flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-2xl font-bold text-center">
        Нада решить вордли или не пустим
      </h2>
      <p className="text-sm text-zinc-400">
        {solution
          ? isLive
            ? 'Слово взято из реального вордли'
            : 'Офлайн-словарь дня активирован'
          : 'Загружаем слово дня...'}
      </p>

      <div className="grid gap-2 my-2">
        {Array.from({ length: 6 }).map((_, rowIdx) => {
          const guess = guesses[rowIdx] ?? '';
          const states =
            guess && solution ? evaluateGuess(guess, solution) : null;

          return (
            <div key={rowIdx} className="flex gap-2">
              {Array.from({ length: 5 }).map((__, colIdx) => {
                const char = guess[colIdx] ?? '';
                const color = states
                  ? badgeStyle[states[colIdx]]
                  : 'bg-zinc-900 border-zinc-700';
                return (
                  <div
                    key={colIdx}
                    className={`w-12 h-12 border-2 rounded flex items-center justify-center text-xl font-bold uppercase ${color}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          maxLength={5}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          placeholder="5 БУКВ"
          disabled={!solution}
          className="px-4 py-2 rounded bg-zinc-900 border border-zinc-600 uppercase tracking-widest text-center font-bold focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!solution || currentInput.length !== 5}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 font-semibold cursor-pointer"
        >
          Проверить
        </button>
      </form>

      {solution && (
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className="text-xs text-zinc-500 hover:text-zinc-300 underline cursor-pointer mt-2"
        >
          {showHint ? `Слово дня: ${solution}` : 'Я препод, пустите меня'}
        </button>
      )}
    </div>
  );
}