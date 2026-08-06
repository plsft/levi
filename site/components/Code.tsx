import type { ReactNode } from "react";

/**
 * Lightweight syntax highlighter for example pages.
 *
 * Takes raw code as a string child and renders it with the site's
 * existing `syn-*` token classes (same palette as the hand-tokenized
 * CodeBlock samples). Zero dependencies — a single-pass regex tokenizer
 * good enough for the TS/JSX, JSON, and shell samples in the docs.
 */

type Lang = "ts" | "json" | "bash" | "text";

const KEYWORDS = new Set([
  "import", "export", "from", "default", "const", "let", "var", "new",
  "return", "async", "await", "function", "class", "extends", "implements",
  "interface", "type", "if", "else", "for", "while", "do", "of", "in",
  "try", "catch", "finally", "throw", "switch", "case", "break", "continue",
  "typeof", "instanceof", "void", "delete", "yield", "static", "get", "set",
  "public", "private", "protected", "readonly", "as", "satisfies", "null",
  "undefined", "true", "false", "this", "super",
]);

const TOKEN =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\[\s\S])*`)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([{}()[\].,;:])|(=>|[-+*/%<>=!&|?^~@#\\]+)|([\s\S])/g;

function nextNonSpace(source: string, index: number): string {
  for (let i = index; i < source.length; i++) {
    const ch = source[i];
    if (ch !== " " && ch !== "\t") return ch;
  }
  return "";
}

function highlightCode(source: string, lang: Lang): ReactNode[] {
  const out: ReactNode[] = [];
  let key = 0;
  const push = (cls: string | null, text: string) => {
    out.push(cls ? <span key={key++} className={cls}>{text}</span> : text);
  };

  if (lang === "text") {
    return [source];
  }

  if (lang === "bash") {
    for (const line of source.split(/(?<=\n)/)) {
      const trimmed = line.trimStart();
      if (trimmed.startsWith("#")) {
        push("syn-cmt", line);
      } else {
        const m = line.match(/^(\s*)(\S+)([\s\S]*)$/);
        if (m) {
          if (m[1]) push(null, m[1]);
          push("syn-fn", m[2]);
          push(null, m[3]);
        } else {
          push(null, line);
        }
      }
    }
    return out;
  }

  for (const m of source.matchAll(TOKEN)) {
    const [full, comment, str, num, ident, ws, punc, op] = m;
    const after = (m.index ?? 0) + full.length;

    if (comment !== undefined) push("syn-cmt", full);
    else if (str !== undefined) {
      // JSON keys (and TS object keys written as strings) read as properties
      push(nextNonSpace(source, after) === ":" ? "syn-prop" : "syn-str", full);
    } else if (num !== undefined) push("syn-num", full);
    else if (ident !== undefined) {
      const next = nextNonSpace(source, after);
      if (KEYWORDS.has(full)) push("syn-kw", full);
      else if (next === "(") push("syn-fn", full);
      else if (next === ":") push("syn-prop", full);
      else if (/^[A-Z]/.test(full)) push("syn-type", full);
      else push("syn-const", full);
    } else if (ws !== undefined) push(null, full);
    else if (punc !== undefined) push("syn-punc", full);
    else if (op !== undefined) push("syn-op", full);
    else push(null, full);
  }

  return out;
}

function detectLang(source: string): Lang {
  if (/[├└│]/.test(source)) return "text";
  const trimmed = source.trimStart();
  if (/^[{[]/.test(trimmed) && /"[\w$-]+"\s*:/.test(source)) return "json";
  const lines = source.split("\n").filter((l) => l.trim().length > 0);
  const shellish = lines.filter((l) =>
    /^\s*(\$|#|levi\s|npx\s|npm\s|wrangler\s|git\s|curl\s)/.test(l),
  );
  if (lines.length > 0 && shellish.length >= lines.length * 0.6) return "bash";
  return "ts";
}

export function Code({
  children,
  lang,
}: {
  /** Raw code as a single string. */
  children: string;
  /** Override language detection: "ts" | "json" | "bash" | "text". */
  lang?: Lang;
}) {
  const resolved = lang ?? detectLang(children);
  return (
    <pre className="bg-denim-900 border border-denim-700 rounded-lg p-4 text-denim-100 text-sm overflow-x-auto">
      {highlightCode(children, resolved)}
    </pre>
  );
}
