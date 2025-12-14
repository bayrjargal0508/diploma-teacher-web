import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Processes HTML content and renders LaTeX math expressions using KaTeX
 * Supports both inline math ($...$) and block math ($$...$$)
 * 
 * @param html - HTML string that may contain LaTeX math expressions
 * @returns Processed HTML with math expressions rendered
 */
export function processMathInHtml(html: string): string {
  if (!html) return "";

  // Process block math ($$...$$)
  let processed = html.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch (error) {
      console.error("KaTeX block math error:", error);
      return match; // Return original if rendering fails
    }
  });

  // Process inline math ($...$)
  // Use negative lookahead/lookbehind to avoid matching $$...$$
  processed = processed.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (error) {
      console.error("KaTeX inline math error:", error);
      return match; // Return original if rendering fails
    }
  });

  return processed;
}

