import { spawn } from "child_process";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return new Response("URL is required", { status: 400 });

  const encoder = new TextEncoder();

  // We return a ReadableStream so the frontend can watch the download happen
  const stream = new ReadableStream({
    start(controller) {
      const pythonProcess = spawn("python.exe", ["src/lib/downloader.py", url]);

      pythonProcess.stdout.on("data", (data) => {
        // This is where we catch those print(json.dumps(...)) lines from Python
        const lines = data.toString().split("\n");
        for (const line of lines) {
          if (line.trim()) {
            controller.enqueue(encoder.encode(`data: ${line}\n\n`));
          }
        }
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python Error: ${data}`);
      });

      pythonProcess.on("close", (code) => {
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
