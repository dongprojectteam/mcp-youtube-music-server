import { FastMCP } from "fastmcp";
import { z } from "zod";
import { config } from "dotenv";
import fetch from "node-fetch";

config();

if (!process.env.YOUTUBE_API_KEY) {
  console.error("Error: YOUTUBE_API_KEY not set");
  process.exit(1);
}

export function registerYoutubeMusicSearchTool(server: FastMCP) {
  server.addTool({
    name: "search_music",
    description: "유튜브 뮤직에서 음악을 검색합니다.",
    parameters: z.object({
      query: z.string().describe("검색어 예: '아이유 블루밍'"),
    }),
    execute: async (args, { reportProgress }) => {
      const { query } = args;

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${process.env.YOUTUBE_API_KEY}&maxResults=5`
      );

      type YouTubeItem = {
        id: { videoId: string };
        snippet: { title: string; channelTitle: string };
      };
      type YouTubeResponse = { items: YouTubeItem[] };
      
      const data = await res.json() as YouTubeResponse;

      const results = (data.items || []).map((item: any) => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        channelTitle: item.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));

      return {
        content: [
          {
            type: "text",
            text: results.map((r, i) =>
              `${i + 1}. ${r.title} - ${r.channelTitle}\n${r.url}`
            ).join("\n\n"),
          },
        ],
      };
    },
  });
}
