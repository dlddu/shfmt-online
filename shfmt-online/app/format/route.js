import child_process from "node:child_process";
import { v4 } from "uuid";
import util from "node:util";
import fs from "node:fs";

const exec = util.promisify(child_process.exec);

export async function POST(request) {
  const body = await request.text();
  const requestId = v4();

  fs.writeFileSync(requestId, body);
  const result = await exec(`shfmt ${requestId}`);
  fs.unlinkSync(requestId);

  return new Response(result.stderr ? result.stderr : result.stdout);
}
