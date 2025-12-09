"use client";
import { useRef } from "react";
import "mathlive";
import katex from "katex";
// katex CSS-г загвар руу оруулна (жирийн CSS import)
import "katex/dist/katex.min.css";

export default function MathToImage({ onUpload }: { onUpload: (dataUrl: string) => void }) {
  const ref = useRef<any>(null);

  const exportAsSVG = async () => {
    const mf = ref.current;
    if (!mf) return;
    // MathLive ашигласан тохиолдолд LaTeX-ийг авах
    const latex = mf.getValue?.() ?? mf.value ?? "";

    // 1) KaTeX-ээр HTML рендер хийнэ
    const html = katex.renderToString(latex, { throwOnError: false });

    // 2) CSS-г inline болгох (katex css шаардлагатай). Энд шаардлагатай минимал CSS-г оруулна.
    // (Илүү найдвартай бол бүрэн katex CSS-ийг string болгон оруулах)
    const katexCss = `
      .katex { font: 1em / 1 "Times New Roman"; }
      .katex .katex-html { display: inline-block; }
    `;

    // 3) SVG-д HTML-г foreignObject ашиглан оруулах
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg'>
        <foreignObject x='0' y='0' width='1000' height='200'>
          <style>${katexCss}</style>
          <div xmlns="http://www.w3.org/1999/xhtml">${html}</div>
        </foreignObject>
      </svg>
    `.trim();

    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    // SVG dataURL (string) үүсгэх
    const reader = new FileReader();
    reader.onload = () => {
      const svgDataUrl = reader.result as string; // "data:image/svg+xml;utf8,<svg>..."
      onUpload(svgDataUrl);
      URL.revokeObjectURL(svgUrl);
    };
    reader.readAsDataURL(svgBlob);
  };

  const exportAsPNG = async () => {
    const mf = ref.current;
    if (!mf) return;
    const latex = mf.getValue?.() ?? mf.value ?? "";

    const html = katex.renderToString(latex, { throwOnError: false });
    const katexCss = `
      .katex { font: 1em / 1 "Times New Roman"; }
    `;

    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg'>
        <foreignObject x='0' y='0' width='1000' height='200'>
          <style>${katexCss}</style>
          <div xmlns="http://www.w3.org/1999/xhtml">${html}</div>
        </foreignObject>
      </svg>
    `.trim();

    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Canvas дээр зурж PNG үүсгэх
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      // canvas хэмжээ сайтар тохируулах — та текстийн өргөнийг хэмжиж тогтооно
      canvas.width = img.width || 1000;
      canvas.height = img.height || 200;
      const ctx = canvas.getContext("2d")!;
      // харгалзах фон хэрэгтэй бол дарж өгнө
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngDataUrl = canvas.toDataURL("image/png");
      onUpload(pngDataUrl);
      URL.revokeObjectURL(svgUrl);
    };
    img.onerror = (e) => {
      console.error("Image load error", e);
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <div>
      <math-field ref={ref} virtual-keyboard="off" style={{ minHeight: 80 }}></math-field>
      <div className="mt-2">
        <button onClick={exportAsSVG}>Export as SVG</button>
        <button onClick={exportAsPNG}>Export as PNG</button>
      </div>
    </div>
  );
}
