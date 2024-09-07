"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

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
          value={output}
        ></textarea>
      </div>
      <button
        className="border-white border-2 w-1/2 self-center"
        onClick={async () => {
          const result = await fetch("/format", {
            method: "POST",
            headers: { "Content-Type": "plain/text" },
            body: input,
          });
          setOutput(await result.text());
        }}
      >
        Format
      </button>
    </main>
  );
}
