const FALLBACK_WORDS = [
  'CRANE', 'SLATE', 'TRACE', 'LOGIC', 'GRAPH',
  'ARRAY', 'STACK', 'QUEUE', 'TOKEN', 'PROXY',
];

async function fetchFromProxy(proxyUrl: string): Promise<string> {
  const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: { solution?: string } = await res.json();
  if (data.solution && /^[a-zA-Z]{5}$/.test(data.solution)) {
    return data.solution.toUpperCase();
  }
  throw new Error('Invalid Wordle payload');
}

export async function fetchTodayWordleSolution(): Promise<{
  word: string;
  isLive: boolean;
}> {
  const today = new Date().toLocaleDateString('en-CA');
  const nytUrl = `https://www.nytimes.com/svc/wordle/v2/${today}.json`;
  const encoded = encodeURIComponent(nytUrl);

  const proxies = [
    `https://corsproxy.io/?url=${encoded}`,
    `https://api.codetabs.com/v1/proxy?quest=${encoded}`,
    `https://api.allorigins.win/raw?url=${encoded}`,
  ];

  try {
    const word = await Promise.any(proxies.map((url) => fetchFromProxy(url)));
    return { word, isLive: true };
  } catch {
    const daySeed = Math.floor(Date.now() / 86_400_000);
    return {
      word: FALLBACK_WORDS[daySeed % FALLBACK_WORDS.length],
      isLive: false,
    };
  }
}