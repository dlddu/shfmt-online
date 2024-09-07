"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [diff, setDiff] = useState("");

  return (
    <main className="flex flex-col gap-10 h-screen">
      <div className="flex gap-10 h-full">
        <textarea
          className="text-slate-700 w-full"
          onChange={(event) => setInput(event.target.value)}
          readOnly={false}
        ></textarea>
        <textarea
          className="text-slate-700 w-full"
          readOnly={true}
          value={result}
        ></textarea>
        <textarea
          className="text-slate-700 w-full"
          readOnly={true}
          value={diff}
        ></textarea>
      </div>
      <button
        className="border-white border-2 w-1/2 self-center"
        onClick={async () => {
          const response = await fetch("/format", {
            method: "POST",
            headers: { "Content-Type": "plain/text" },
            body: input,
          });
          console.log(response);
          const { result, diff } = await response.json();
          setResult(result);
          setDiff(diff);
        }}
      >
        Format
      </button>
    </main>
  );
}
