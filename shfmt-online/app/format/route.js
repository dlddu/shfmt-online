import { exec } from "node:child_process";
import { v4 } from "uuid";
import fs from "node:fs";
import { NextResponse } from "next/server";

const execShfmtDiff = (command) =>
  new Promise((resolve) =>
    exec(command, (_err, stdout, _stderr) => resolve(stdout))
  );

const execShfmt = (command) =>
  new Promise((resolve) =>
    exec(command, (err, stdout, stderr) => {
      if (err !== null) return resolve(stderr);
      else return resolve(stdout);
    })
  );

export async function POST(request) {
  const body = await request.text();
  const requestId = v4();

  fs.writeFileSync(requestId, body);
  const result = await execShfmt(`shfmt -s ${requestId}`);
  const rawDiff = await execShfmtDiff(`shfmt -d -s ${requestId}`);
  fs.unlinkSync(requestId);

  const diff = rawDiff.split("\n").slice(2).join("\n");

  return NextResponse.json({
    result,
    diff: diff !== "" ? diff : "No differences found",
  });
}
