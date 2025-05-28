'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [count, setCount] = useState<number>(0);

  // Load on first render
  useEffect(() => {
    fetch('/api/increment')
      .then((res) => res.json())
      .then((data) => setCount(data.value));
  }, []);

  const increment = async () => {
    const res = await fetch('/api/increment', { method: 'POST' });
    const data = await res.json();
    setCount(data.value);
  };

  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl mb-4">Count: {count}</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={increment}
      >
        Increment
      </button>
    </main>
  );
}