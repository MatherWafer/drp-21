'use client';

import { useState } from 'react';

export default function CounterButton({ id }: { id: number }) {
  const [count, setCount] = useState<number | null>(null);

  async function increment() {
    const res = await fetch('/api/increment', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setCount(data.count);
  }

  return (
    <div>
      <button onClick={increment} className="p-2 bg-blue-500 text-white rounded">
        Increment
      </button>
      {count !== null && <p>Count: {count}</p>}
    </div>
  );
}