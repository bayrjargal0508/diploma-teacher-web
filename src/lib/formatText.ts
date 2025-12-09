// src/lib/formatText.ts

export type FormatType =
  | "bold"
  | "italic"
  | "underline"
  | "h1"
  | "h2"
  | "math";

const formats: Record<FormatType, (text: string) => string> = {
  bold: (t) => `**${t}**`,
  italic: (t) => `*${t}*`,
  underline: (t) => `<u>${t}</u>`,
  h1: (t) => `# ${t}`,
  h2: (t) => `## ${t}`,
  math: (t) => `$${t}$`,
};

export const formatText = (type: FormatType, selected: string) => {
  const formatter = formats[type];
  return formatter ? formatter(selected) : selected;
};
