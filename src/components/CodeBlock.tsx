import { useMemo } from "react";

const KEYWORDS = [
  "import", "from", "def", "return", "if", "else", "elif", "for", "while",
  "in", "not", "and", "or", "as", "lambda", "class", "True", "False", "None",
  "print", "groupby", "agg", "describe", "apply", "astype", "assign",
  "fillna", "dropna", "drop_duplicates", "isnull", "notna", "merge",
  "resample", "rolling", "ewm", "shift", "pct_change", "sort_values",
  "reset_index", "set_index", "to_csv", "read_csv", "to_datetime",
  "str", "dt", "plot", "fit", "predict", "fit_predict",
];

function highlight(line: string): string {
  // comments
  let s = line.replace(/(#.*)$/, '<span class="cm text-ink-100/60">$1</span>');
  // strings (single & double, basic)
  s = s.replace(/("[^"]*"|'[^']*')/g, '<span class="str text-emerald-300">$1</span>');
  // numbers
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num text-amber-200">$1</span>');
  // keywords
  for (const kw of KEYWORDS) {
    const re = new RegExp(`\\b(${kw})\\b`, "g");
    s = s.replace(re, '<span class="kw text-amber2-500 font-semibold">$1</span>');
  }
  return s;
}

export default function CodeBlock({ code }: { code: string }) {
  const lines = useMemo(() => code.split("\n"), [code]);
  return (
    <div className="rounded-2xl bg-ink-900 p-0 font-mono text-[13px] leading-6 shadow-pop">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-widest text-ink-100/60">
        <span>🐍 Python / pandas</span>
        <span>可直接复制到 Jupyter / VS Code</span>
      </div>
      <pre className="overflow-x-auto px-5 py-4 text-ink-50">
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-4">
            <span className="w-6 shrink-0 select-none text-right text-ink-100/40">
              {idx + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: highlight(line) || "&nbsp;" }} />
          </div>
        ))}
      </pre>
    </div>
  );
}
