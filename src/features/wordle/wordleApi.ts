const FALLBACK_WORDS = [
  'CRANE', 'SLATE', 'TRACE', 'LOGIC', 'GRAPH',
  'ARRAY', 'STACK', 'QUEUE', 'TOKEN', 'PROXY',
];

export async function fetchTodayWordleSolution(): Promise<{
  word: string;
  isLive: boolean;
}> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const nytUrl = `https://www.nytimes.com/svc/wordle/v2/${today}.json`;

  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(nytUrl)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('Proxy failed');

    const data: { solution?: string } = await res.json();
    if (data.solution && /^[a-zA-Z]{5}$/.test(data.solution)) {
      return { word: data.solution.toUpperCase(), isLive: true };
    }
  } catch {

  }

  const daySeed = Math.floor(Date.now() / 86_400_000);
  return {
    word: FALLBACK_WORDS[daySeed % FALLBACK_WORDS.length],
    isLive: false,
  };
}