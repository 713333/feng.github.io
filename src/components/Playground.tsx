import { useEffect, useMemo, useRef, useState } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  drawSelection,
  rectangularSelection,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import { Play, RotateCcw, Terminal, Sparkles, Loader2 } from "lucide-react";

declare global {
  interface Window {
    loadPyodide?: (options?: any) => Promise<any>;
    pyodide?: any;
  }
}

interface PlaygroundProps {
  initialCode?: string;
  title?: string;
  // 预置代码（隐藏执行前的准备代码，如加载示例数据集）
  setupCode?: string;
  // 允许用户切换预设数据集
  presets?: { label: string; code: string }[];
  // 运行前注入数据的代码字典（codeHint 中可引用）
  height?: number;
  minimal?: boolean;
  autoRunSetup?: boolean;
}

type OutputChunk =
  | { type: "text"; content: string }
  | { type: "html"; content: string }
  | { type: "error"; content: string };

const themeCompartment = new Compartment();

const editorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#0F172A",
      color: "#E2E8F0",
      borderRadius: "0 0 12px 12px",
      fontSize: "14px",
      fontFamily:
        "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
    },
    ".cm-scroller": { overflow: "auto", fontFamily: "inherit" },
    ".cm-content": { caretColor: "#F59E0B", padding: "12px 16px" },
    ".cm-gutters": {
      backgroundColor: "#0F172A",
      color: "#64748B",
      border: "none",
      borderRight: "1px solid #1E293B",
    },
    ".cm-activeLine": { backgroundColor: "#1E293B" },
    ".cm-activeLineGutter": { backgroundColor: "#1E293B", color: "#F59E0B" },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      background: "#334155 !important",
    },
    ".cm-foldPlaceholder": {
      background: "#334155",
      color: "#E2E8F0",
      borderRadius: "3px",
      padding: "0 4px",
    },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#F59E0B" },
  },
  { dark: true }
);

const codeMirrorKeymap = [
  ...closeBracketsKeymap,
  ...defaultKeymap,
  ...historyKeymap,
  ...foldKeymap,
  ...completionKeymap,
  indentWithTab,
  {
    key: "Mod-Enter",
    run: () => {
      // 由外部按钮触发，这里不做事
      return true;
    },
  },
];

export default function Playground({
  initialCode = "import pandas as pd\nimport numpy as np\n\nprint('🐍 Python is ready!')\n",
  title = "Python 代码编辑器",
  setupCode,
  presets,
  height = 420,
  minimal = false,
  autoRunSetup = true,
}: PlaygroundProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const stateRef = useRef<EditorState | null>(null);
  const [code, setCode] = useState(initialCode);
  const [outputs, setOutputs] = useState<OutputChunk[]>([]);
  const [running, setRunning] = useState(false);
  const [runtimeStatus, setRuntimeStatus] = useState<
    "idle" | "loading" | "ready"
  >("idle");
  const [pyVersion, setPyVersion] = useState<string>("");
  const stdoutRef = useRef<string[]>([]);
  const stderrRef = useRef<string[]>([]);

  // --- CodeMirror 初始化 ---
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        foldGutter(),
        history(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        highlightActiveLine(),
        rectangularSelection(),
        autocompletion(),
        closeBrackets(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        python(),
        keymap.of(codeMirrorKeymap),
        themeCompartment.of(editorTheme),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString());
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    stateRef.current = state;
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // initialCode 改变时同步编辑器
  useEffect(() => {
    if (!viewRef.current) return;
    const current = viewRef.current.state.doc.toString();
    if (current !== code) {
      viewRef.current.dispatch({
        changes: { from: 0, to: current.length, insert: code },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  // --- Pyodide 懒加载 ---
  async function ensurePyodide(): Promise<any> {
    if (window.pyodide) return window.pyodide;
    setRuntimeStatus("loading");

    // 1) 动态引入 pyodide 的 index.d.ts 不精确，按官方做法用 CDN 脚本
    await new Promise<void>((resolve, reject) => {
      if ((window as any).loadPyodide) return resolve();
      const s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Pyodide 脚本加载失败"));
      document.head.appendChild(s);
    });

    const py = await (window as any).loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
      stdout: (text: string) => {
        stdoutRef.current.push(text);
      },
      stderr: (text: string) => {
        stderrRef.current.push(text);
      },
    });

    await py.loadPackage([
      "micropip",
      "numpy",
      "pandas",
    ]);

    // 安装 openpyxl（pandas 解析 xlsx 时需要）
    try {
      const micropip = py.pyimport("micropip");
      await micropip.install("openpyxl");
    } catch (_e) {
      // ignore
    }

    window.pyodide = py;
    setRuntimeStatus("ready");
    setPyVersion(py.runPython("import sys; sys.version.split()[0]") as string);
    return py;
  }

  // 在组件挂载后（若用户点了运行）就懒加载 Pyodide
  useEffect(() => {
    // 不预加载，按需加载即可
  }, []);

  // 用一段 Python helper 把 DataFrame 转为 HTML 表格，并在末尾自动展示表达式
  const htmlHelper = useMemo(
    () => `
from io import StringIO
import builtins
import html
import sys

def _repr(x):
    if x is None:
        return ""
    try:
        import pandas as pd
        if isinstance(x, (pd.DataFrame, pd.Series)):
            return x.to_html(max_cols=12, max_rows=20, border=0, classes=["pg-table"])
    except Exception:
        pass
    try:
        return html.escape(repr(x))
    except Exception:
        return "[无法展示的对象]"

def _run_user(code):
    """把用户代码最后一条表达式抓出来 eval，其余 exec。
    适用于：在编辑器末尾直接写 df / df.head() / groupby 结果，也能看到表格。
    """
    import ast as _ast
    try:
        tree = _ast.parse(code)
    except SyntaxError:
        # 语法错误：走原始 exec，让 Python 自己报错误
        exec(code, globals())
        return
    if tree.body and isinstance(tree.body[-1], _ast.Expr):
        last = tree.body.pop()
        last_src = _ast.unparse(last)
        exec(compile(_ast.Module(body=tree.body, type_ignores=[]), "<pg>", "exec"), globals())
        result = eval(last_src, globals())
        out = _repr(result)
        if out:
            print(out)
    else:
        exec(code, globals())
`,
    []
  );

  async function run() {
    if (running) return;
    setRunning(true);
    setOutputs([]);
    stdoutRef.current = [];
    stderrRef.current = [];

    try {
      const py = await ensurePyodide();

      // 先运行 setupCode（预置数据等）
      if (autoRunSetup && setupCode) {
        try {
          await py.runPythonAsync(htmlHelper + "\n" + setupCode);
        } catch (err: any) {
          stderrRef.current.push(
            "[setup 代码出错] " + (err?.message || String(err))
          );
        }
      }

      // 用 helper 里的 _run_user() 执行用户代码
      const userCode = code.trimEnd();
      const scriptToRun =
        htmlHelper +
        "\n" +
        (setupCode && !autoRunSetup ? setupCode + "\n" : "") +
        `_run_user(${JSON.stringify(userCode)})\n`;

      await py.runPythonAsync(scriptToRun);

      // 组装输出
      const chunks: OutputChunk[] = [];
      const stdout = stdoutRef.current.join("");
      if (stdout.trim().length > 0) {
        // 如果内容中含有 <table 标签，按 HTML 渲染
        const isHtml = /<table/i.test(stdout);
        chunks.push({
          type: isHtml ? "html" : "text",
          content: stdout,
        });
      }
      const stderr = stderrRef.current.join("");
      if (stderr.trim().length > 0) {
        chunks.push({ type: "error", content: stderr });
      }
      if (chunks.length === 0) {
        chunks.push({
          type: "text",
          content:
            "（运行完成，没有任何输出）\n提示：用 print(变量) 或直接写变量名查看结果。",
        });
      }

      setOutputs(chunks);
    } catch (err: any) {
      const message = err?.message || String(err);
      setOutputs([{ type: "error", content: message }]);
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setOutputs([]);
    if (viewRef.current) {
      const len = viewRef.current.state.doc.length;
      viewRef.current.dispatch({
        changes: { from: 0, to: len, insert: initialCode },
      });
    }
    setCode(initialCode);
  }

  function applyPreset(presetCode: string) {
    if (!viewRef.current) return;
    const len = viewRef.current.state.doc.length;
    viewRef.current.dispatch({
      changes: { from: 0, to: len, insert: presetCode },
    });
    setCode(presetCode);
  }

  return (
    <div
      className={
        "overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft " +
        (minimal ? "" : "")
      }
    >
      {/* 顶部条 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-gradient-to-r from-ink-900 to-slate-800 px-5 py-3 text-ink-50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-amber2-500" />
          <span className="font-serif text-sm text-white">{title}</span>
          <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-amber2-400 sm:inline">
            {runtimeStatus === "ready"
              ? `Python ${pyVersion} · 已就绪`
              : runtimeStatus === "loading"
              ? "正在加载运行时…"
              : "运行时未加载（点击 ▶ 运行自动加载）"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {presets && presets.length > 0 && (
            <select
              onChange={(e) => {
                const target = presets.find((p) => p.label === e.target.value);
                if (target) applyPreset(target.code);
                e.currentTarget.value = "";
              }}
              defaultValue=""
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-amber2-500 hover:text-amber2-500"
            >
              <option value="" disabled>
                切换示例…
              </option>
              {presets.map((p) => (
                <option key={p.label} value={p.label} className="text-ink-900">
                  {p.label}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-amber2-500 hover:text-amber2-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </button>
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber2-500 px-4 py-1.5 text-xs font-semibold text-ink-900 shadow-soft transition hover:bg-amber2-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {running ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                运行中…
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                ▶ 运行代码
              </>
            )}
          </button>
        </div>
      </div>

      {/* 编辑器 */}
      <div
        ref={editorRef}
        style={{ height: `${height}px` }}
        className="relative bg-[#0F172A]"
      />

      {/* 输出面板 */}
      <div className="border-t border-ink-100">
        <div className="flex items-center justify-between bg-ink-50/70 px-5 py-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink-500">
            <Sparkles className="h-3.5 w-3.5 text-amber2-500" />
            运行结果
          </span>
          <span className="text-[11px] text-ink-400">
            提示：print()、DataFrame / Series 的展示都可在这里看到
          </span>
        </div>
        <div className="max-h-72 overflow-auto px-5 py-4">
          {outputs.length === 0 && !running && (
            <div className="py-6 text-center text-sm text-ink-400">
              还没有输出 —— 点右上角「▶ 运行代码」试试吧
            </div>
          )}
          {outputs.map((o, i) => {
            if (o.type === "html") {
              return (
                <div
                  key={i}
                  className="pg-html mb-2 overflow-auto rounded-xl border border-ink-100 bg-white p-2 text-xs"
                  dangerouslySetInnerHTML={{ __html: o.content }}
                />
              );
            }
            if (o.type === "error") {
              return (
                <pre
                  key={i}
                  className="mb-2 whitespace-pre-wrap rounded-xl border border-red-100 bg-red-50/80 p-4 text-[13px] leading-6 text-red-800"
                >
                  {o.content}
                </pre>
              );
            }
            return (
              <pre
                key={i}
                className="mb-2 whitespace-pre-wrap rounded-xl border border-ink-100 bg-ink-50/60 p-4 text-[13px] leading-6 text-ink-800"
              >
                {o.content}
              </pre>
            );
          })}
        </div>
      </div>

      <style>{`
        .pg-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .pg-table thead th { background: #F1F5F9; color: #0F172A; font-weight: 600; padding: 6px 10px; border-bottom: 1px solid #E2E8F0; text-align: left; }
        .pg-table tbody td { padding: 5px 10px; border-bottom: 1px solid #F1F5F9; }
        .pg-table tbody tr:nth-child(even) td { background: #FAFBFC; }
        .pg-table tbody tr:hover td { background: #FFFBEB; }
        .pg-table td:first-child, .pg-table th:first-child { color: #94A3B8; font-weight: 500; }
      `}</style>
    </div>
  );
}
