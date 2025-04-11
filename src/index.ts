import { FastMCP } from "fastmcp";
import { config } from "dotenv";
import { registerYoutubeMusicSearchTool } from "./tools/registerYoutubeSearchTool.js";

config();

const server = new FastMCP({
  name: "youtube-music-mcp",
  version: "1.0.0"
});

registerYoutubeMusicSearchTool(server);

async function main() {
  try {
    await server.start({
      transportType: "stdio",
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

