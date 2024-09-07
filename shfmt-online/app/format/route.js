import { exec } from "node:child_process";
import { v4 } from "uuid";
import fs from "node:fs";
import { NextResponse } from "next/server";

const execAndResolve = (command, resolve) => {
  const execCallbackHandler = (_err, stdout, _stderr) => resolve(stdout);
  exec(command, execCallbackHandler);
};
const execPromise = (command) =>
  new Promise((resolve) => execAndResolve(command, resolve));

export async function POST(request) {
  const body = await request.text();
  const requestId = v4();

  fs.writeFileSync(requestId, body);
  const result = await execPromise(`shfmt -s ${requestId}`);
  const rawDiff = await execPromise(`shfmt -d -s ${requestId}`);
  fs.unlinkSync(requestId);

  const diff = rawDiff.split("\n").slice(2).join("\n");

  return NextResponse.json({
    result,
    diff: diff !== "" ? diff : "No differences found",
  });
}
