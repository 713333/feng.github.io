import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  rectangularSelection,
  highlightSpecialChars,
  highlightTrailingWhitespace,
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
import {
  Play,
  RotateCcw,
  Terminal,
  Sparkles,
  Loader2,
  Upload,
  FileJson,
  FileSpreadsheet,
  Save,
  FolderOpen,
  Share2,
  X,
  Check,
  FileCode2,
  Trash2,
  Clipboard,
  Copy,
  Wand2,
  ChevronRight,
} from "lucide-react";

declare global {
  interface Window {
    loadPyodide?: (options?: any) => Promise<any>;
    pyodide?: any;
  }
}

interface PlaygroundProps {
  initialCode?: string;
  title?: string;
  setupCode?: string;
  presets?: { label: string; code: string }[];
  height?: number;
  minimal?: boolean;
  autoRunSetup?: boolean;
  // 每一个 Playground 实例有独立的自动保存 key，默认 "default"
  storageKey?: string;
}

type OutputChunk =
  | { type: "text"; content: string }
  | { type: "html"; content: string }
  | { type: "error"; content: string }
  | { type: "info"; content: string };

// ======================== 本地存储工具 ========================
const LS_PREFIX = "pg4edu:";
const LS_UPLOADS = `${LS_PREFIX}uploads`;
const LS_SNIPPETS = `${LS_PREFIX}snippets`;
const LS_AUTOSAVE = `${LS_PREFIX}autosave`;

interface UploadedFile {
  id: string;
  name: string;
  kind: "csv" | "xlsx" | "json";
  size: number;
  // Base64 编码的文件内容（JSON 存原文）
  data: string;
  createdAt: number;
}

interface Snippet {
  id: string;
  name: string;
  code: string;
  createdAt: number;
  updatedAt: number;
}

function readLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}
function writeLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function pickKind(filename: string): UploadedFile["kind"] | null {
  const n = filename.toLowerCase();
  if (n.endsWith(".csv")) return "csv";
  if (n.endsWith(".xlsx") || n.endsWith(".xls")) return "xlsx";
  if (n.endsWith(".json")) return "json";
  return null;
}

function sanitizeVarName(name: string): string {
  // 将文件名转为合法 Python 变量名
  const base = name.replace(/\.[^.]+$/, "").replace(/[^A-Za-z0-9_]/g, "_");
  if (/^\d/.test(base)) return `_${base}`;
  return base || "data";
}

// 简单压缩 / 解压（URL 友好的 Base64）
function toSharedURL(code: string): string {
  try {
    const bytes = new TextEncoder().encode(code);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const b64 = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return `${location.origin}${location.pathname}#code=${b64}`;
  } catch {
    return "";
  }
}
function fromSharedURL(): string | null {
  const h = location.hash;
  const m = /[#&]code=([^&]+)/.exec(h);
  if (!m) return null;
  try {
    let b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

// ======================== CodeMirror 主题（暗色强化）========================
const themeCompartment = new Compartment();

const editorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#0B1120",
      color: "#E2E8F0",
      borderRadius: "0 0 12px 12px",
      fontSize: "14px",
      fontFamily:
        "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
      lineHeight: "1.65",
    },
    ".cm-editor": { outline: "none" },
    ".cm-editor.cm-focused": { outline: "none" },
    ".cm-scroller": { overflow: "auto", fontFamily: "inherit" },
    ".cm-content": {
      caretColor: "#F59E0B",
      padding: "14px 18px",
    },
    ".cm-line": { padding: "0 4px" },
    ".cm-gutters": {
      backgroundColor: "#0B1120",
      color: "#475569",
      border: "none",
      borderRight: "1px solid #1E293B",
    },
    ".cm-activeLine": { backgroundColor: "#131C2E" },
    ".cm-activeLineGutter": {
      backgroundColor: "#131C2E",
      color: "#F59E0B",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      background: "#1E3A8A !important",
    },
    ".cm-foldPlaceholder": {
      background: "#1E293B",
      color: "#E2E8F0",
      borderRadius: "3px",
      padding: "0 6px",
      border: "none",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#F59E0B",
      borderLeftWidth: "2px",
    },
    ".cm-tooltip": {
      backgroundColor: "#1E293B",
      border: "1px solid #334155",
      color: "#E2E8F0",
      borderRadius: "8px",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(245,158,11,0.25)",
      borderBottom: "1px solid #F59E0B",
      color: "#FDE68A",
    },
    // Python 语法高亮覆盖（在 defaultHighlightStyle 基础上增强可读性）
    "& .tok-keyword": { color: "#F472B6" },
    "& .tok-string, & .tok-string2": { color: "#86EFAC" },
    "& .tok-number": { color: "#FBBF24" },
    "& .tok-comment, & .tok-lineComment, & .tok-blockComment": {
      color: "#64748B",
      fontStyle: "italic",
    },
    "& .tok-definition, & .tok-functionName": { color: "#60A5FA" },
    "& .tok-className": { color: "#A78BFA" },
    "& .tok-operator": { color: "#FCA5A5" },
    "& .tok-propertyName": { color: "#FDE68A" },
  },
  { dark: true }
);

// ======================== 预置模板 ========================
const CODE_TEMPLATES: { label: string; code: string }[] = [
  {
    label: "pandas 基础",
    code: `import pandas as pd

data = {
    "name": ["小明", "小红", "小刚", "小丽"],
    "score": [88, 92, 75, 96],
    "grade": ["A", "A", "B", "A"],
}
df = pd.DataFrame(data)
print(df)
print("\\n平均分:", df["score"].mean())
`,
  },
  {
    label: "数据清洗",
    code: `import pandas as pd
import numpy as np

data = {
    "id": [1, 2, 3, 4, 5, 6],
    "age": [22, np.nan, 25, 27, np.nan, 31],
    "city": ["北京", "上海", None, "北京", "上海", "北京"],
    "salary": [8000, 12000, 9500, None, 18000, 15000],
}
df = pd.DataFrame(data)

print("原始：")
print(df)
print("\\n缺失值统计：")
print(df.isna().sum())
print("\\n用中位数填充 age：")
df["age"] = df["age"].fillna(df["age"].median())
print(df)
print("\\n按 city 分组统计平均薪资：")
print(df.dropna(subset=["salary"]).groupby("city")["salary"].mean())
`,
  },
  {
    label: "购物车分析",
    code: `import pandas as pd
from itertools import combinations
from collections import Counter

# 模拟购物车数据
carts = [
    ["牛奶", "面包", "鸡蛋"],
    ["牛奶", "面包", "黄油", "鸡蛋"],
    ["牛奶", "咖啡", "饼干"],
    ["面包", "鸡蛋", "饼干"],
    ["牛奶", "面包", "鸡蛋", "饼干"],
    ["咖啡", "饼干", "牛奶"],
]

# 1. 单品频次
items = [it for cart in carts for it in cart]
counter = Counter(items)
print("单品出现次数：")
for item, cnt in counter.most_common():
    print(f"  {item}: {cnt}")

# 2. 二元组合热度
pair_counter = Counter()
for cart in carts:
    for a, b in combinations(sorted(cart), 2):
        pair_counter[(a, b)] += 1

print("\\n热门商品组合（至少出现 2 次）：")
for (a, b), cnt in pair_counter.most_common():
    if cnt >= 2:
        print(f"  {a} + {b}: {cnt} 次")
`,
  },
  {
    label: "K-Means 聚类",
    code: `import numpy as np
import pandas as pd

# 简易 K-Means 实现（不依赖 sklearn）
np.random.seed(42)

# 生成 3 簇样本
c1 = np.random.normal([2, 2], 0.6, size=(50, 2))
c2 = np.random.normal([8, 3], 0.7, size=(40, 2))
c3 = np.random.normal([5, 9], 0.8, size=(35, 2))
X = np.vstack([c1, c2, c3])

k = 3
max_iter = 20
centers = X[np.random.choice(len(X), k, replace=False)]

for _ in range(max_iter):
    dists = np.linalg.norm(X[:, None, :] - centers[None, :, :], axis=2)
    labels = dists.argmin(axis=1)
    new_centers = np.array([X[labels == i].mean(axis=0) for i in range(k)])
    if np.allclose(centers, new_centers):
        break
    centers = new_centers

df = pd.DataFrame(X, columns=["x", "y"])
df["cluster"] = labels
print("每个簇的样本数：")
print(df["cluster"].value_counts().sort_index())
print("\\n簇中心：")
for i, c in enumerate(centers):
    print(f"  簇 {i}: ({c[0]:.2f}, {c[1]:.2f})")
print("\\n前 5 条样本：")
print(df.head())
`,
  },
  {
    label: "RFM 用户分层",
    code: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 200
data = {
    "user_id": np.arange(1, n + 1),
    "recency": np.random.randint(1, 365, n),   # 距上次消费天数
    "frequency": np.random.randint(1, 30, n),  # 消费次数
    "monetary": np.random.randint(50, 5000, n),# 消费金额
}
df = pd.DataFrame(data)

# 打分：R 越低越好；F / M 越高越好
df["R_score"] = pd.qcut(df["recency"], 5, labels=[5, 4, 3, 2, 1]).astype(int)
df["F_score"] = pd.qcut(df["frequency"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5]).astype(int)
df["M_score"] = pd.qcut(df["monetary"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5]).astype(int)
df["RFM"] = df["R_score"].astype(str) + df["F_score"].astype(str) + df["M_score"].astype(str)

def segment(row):
    r, f, m = row["R_score"], row["F_score"], row["M_score"]
    if r >= 4 and f >= 4 and m >= 4:
        return "价值用户"
    if r <= 2 and f >= 4:
        return "流失风险"
    if r >= 4 and f <= 2:
        return "新用户"
    if r <= 2 and f <= 2:
        return "已流失"
    return "普通用户"

df["segment"] = df.apply(segment, axis=1)

print("RFM 分层结果：")
print(df.groupby("segment").agg(
    用户数=("user_id", "count"),
    平均金额=("monetary", "mean"),
).round(0))
`,
  },
];

// ======================== 组件 ========================
export default function Playground({
  initialCode = "import pandas as pd\nimport numpy as np\n\nprint('🐍 Python is ready! 按 Ctrl + Enter 运行代码')\n",
  title = "Python 代码编辑器",
  setupCode,
  presets,
  height = 420,
  minimal = false,
  autoRunSetup = true,
  storageKey = "default",
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

  // 数据集上传
  const [uploads, setUploads] = useState<UploadedFile[]>(() =>
    readLS<UploadedFile[]>(LS_UPLOADS, [])
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 代码片段管理
  const [snippets, setSnippets] = useState<Snippet[]>(() =>
    readLS<Snippet[]>(LS_SNIPPETS, [])
  );
  const [showSnippets, setShowSnippets] = useState(false);
  const [snippetName, setSnippetName] = useState("");
  const [savingSnippet, setSavingSnippet] = useState(false);

  // 分享
  const [shareURL, setShareURL] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // 自动保存状态提示
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const autosaveKey = `${LS_AUTOSAVE}:${storageKey}`;

  // --- 启动时：优先读取 URL hash / 自动保存 ---
  useEffect(() => {
    const fromURL = fromSharedURL();
    if (fromURL) {
      setCode(fromURL);
      return;
    }
    const saved = readLS<string | null>(autosaveKey, null);
    if (saved) setCode(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 自动保存（debouce 800ms）---
  useEffect(() => {
    const t = setTimeout(() => {
      writeLS(autosaveKey, code);
      setSavedAt(Date.now());
    }, 800);
    return () => clearTimeout(t);
  }, [code, autosaveKey]);

  // --- persist uploads / snippets ---
  useEffect(() => writeLS(LS_UPLOADS, uploads), [uploads]);
  useEffect(() => writeLS(LS_SNIPPETS, snippets), [snippets]);

  // 构建 run 函数触发 ref（供 keymap 调用）
  const runRef = useRef<() => void>(() => {});

  const codeMirrorKeymap = useMemo(
    () => [
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      indentWithTab,
      {
        key: "Mod-Enter",
        preventDefault: true,
        run: () => {
          runRef.current();
          return true;
        },
      },
      {
        key: "Mod-s",
        preventDefault: true,
        run: () => {
          writeLS(autosaveKey, code);
          setSavedAt(Date.now());
          setOutputs((prev) => [
            ...prev,
            { type: "info", content: "💾 已手动保存（Ctrl+S）" },
          ]);
          return true;
        },
      },
    ],
    [autosaveKey, code]
  );

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
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        highlightTrailingWhitespace(),
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

  // initialCode 改变时同步编辑器（仅当编辑器内容与目标都不同时）
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

  // --- Pyodide 懒加载（组件挂载即开始预加载） ---
  async function ensurePyodide(): Promise<any> {
    if (window.pyodide) return window.pyodide;

    // 避免并发多次加载
    if ((window as any).__pyodideLoading) {
      return (window as any).__pyodideLoading;
    }

    setRuntimeStatus("loading");
    const loadPromise = (async () => {
      await new Promise<void>((resolve, reject) => {
        if ((window as any).loadPyodide) return resolve();
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => {
          reject(
            new Error(
              "Pyodide 脚本加载失败（网络/CDN 可能被阻断，请检查网络或稍后重试）"
            )
          );
        };
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

      await py.loadPackage(["micropip", "numpy", "pandas"]);

      // 预安装 openpyxl（解析 xlsx 上传需要）
      try {
        const micropip = py.pyimport("micropip");
        await micropip.install("openpyxl");
      } catch {
          // 不致命：用户真要解析 xlsx 时会再尝试
        }

      window.pyodide = py;
      setRuntimeStatus("ready");
      setPyVersion(
        (py.runPython("import sys; sys.version.split()[0]") as string) ||
          "3.x"
      );
      return py;
    })();

    (window as any).__pyodideLoading = loadPromise;
    loadPromise.finally(() => {
      (window as any).__pyodideLoading = null;
    });
    return loadPromise;
  }

  // 组件挂载即开始预加载 Pyodide（不阻塞渲染）
  useEffect(() => {
    const t = setTimeout(() => {
      ensurePyodide().catch((err) => {
        setOutputs((prev) => [
          ...prev,
          {
            type: "error",
            content:
              "[提示] Python 运行时预加载失败：" +
              (err?.message || String(err)) +
              "\n你可以先编辑代码，点「▶ 运行」时会再次尝试。",
          },
        ]);
      });
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Python helper
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
    import ast as _ast
    try:
        tree = _ast.parse(code)
    except SyntaxError:
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

  // 生成 Python 代码：把已上传文件读入到运行时并暴露 DataFrame 变量
  function buildUploadsSetup(): string {
    if (uploads.length === 0) return "";
    const lines: string[] = [
      "# ========= 你的数据集 ========= ",
      "import io as _pg_io",
      "import base64 as _pg_b64",
      "import pandas as _pg_pd",
      "",
    ];
    for (const u of uploads) {
      const varName = sanitizeVarName(u.name);
      lines.push(`# 文件：${u.name}（${(u.size / 1024).toFixed(1)} KB）`);
      if (u.kind === "csv") {
        // dataURL: "data:text/csv;base64,..."
        lines.push(`_pg_bytes_${u.id} = _pg_b64.b64decode("${u.data.replace(
          /^data:[^,]+,/,
          ""
        )}")`);
        lines.push(
          `try:\n    ${varName} = _pg_pd.read_csv(_pg_io.BytesIO(_pg_bytes_${u.id}))\nexcept Exception as _e:\n    ${varName} = _pg_pd.DataFrame({"错误": [str(_e)]})`
        );
        lines.push(
          `print(f"[已载入] {varName} = {len(${varName})} 行 × {len(${varName}.columns)} 列\\n")`
        );
      } else if (u.kind === "xlsx") {
        lines.push(`_pg_bytes_${u.id} = _pg_b64.b64decode("${u.data.replace(
          /^data:[^,]+,/,
          ""
        )}")`);
        lines.push(
          `try:\n    ${varName} = _pg_pd.read_excel(_pg_io.BytesIO(_pg_bytes_${u.id}), engine="openpyxl")\nexcept Exception as _e:\n    ${varName} = _pg_pd.DataFrame({"错误": [str(_e)]})`
        );
        lines.push(
          `print(f"[已载入] {varName} = {len(${varName})} 行 × {len(${varName}.columns)} 列\\n")`
        );
      } else if (u.kind === "json") {
        const jsonTxt = u.data;
        const escaped = jsonTxt.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
        lines.push(`_pg_json_${u.id} = "${escaped}"`);
        lines.push(
          `try:\n    ${varName} = _pg_pd.read_json(_pg_io.StringIO(_pg_json_${u.id}))\nexcept Exception as _e:\n    try:\n        import json as _pg_json\n        ${varName} = _pg_pd.json_normalize(_pg_json.loads(_pg_json_${u.id}))\n    except Exception as _e2:\n        ${varName} = _pg_pd.DataFrame({"错误": [str(_e), str(_e2)]})`
        );
        lines.push(
          `print(f"[已载入] {varName} = {len(${varName})} 行 × {len(${varName}.columns)} 列\\n")`
        );
      }
      lines.push("");
    }
    lines.push("# ============================ ");
    lines.push("");
    return lines.join("\n");
  }

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setOutputs([]);
    stdoutRef.current = [];
    stderrRef.current = [];

    try {
      const py = await ensurePyodide();

      // 1) setupCode：预置
      if (autoRunSetup && setupCode) {
        try {
          await py.runPythonAsync(htmlHelper + "\n" + setupCode);
        } catch (err: any) {
          stderrRef.current.push(
            "[setup 代码出错] " + (err?.message || String(err))
          );
        }
      }

      // 2) 上传文件的数据集
      const uploadsSetup = buildUploadsSetup();
      if (uploadsSetup) {
        try {
          await py.runPythonAsync(htmlHelper + "\n" + uploadsSetup);
        } catch (err: any) {
          stderrRef.current.push(
            "[数据集载入出错] " + (err?.message || String(err))
          );
        }
      }

      // 3) 用户代码
      const userCode = code.trimEnd();
      const scriptToRun =
        htmlHelper +
        "\n" +
        (setupCode && !autoRunSetup ? setupCode + "\n" : "") +
        `_run_user(${JSON.stringify(userCode)})\n`;

      await py.runPythonAsync(scriptToRun);

      const chunks: OutputChunk[] = [];
      const stdout = stdoutRef.current.join("");
      if (stdout.trim().length > 0) {
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
  }, [running, autoRunSetup, setupCode, htmlHelper, code, uploads]);

  // 暴露 run 到 ref，便于快捷键触发
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  function reset() {
    setOutputs([]);
    if (viewRef.current) {
      const len = viewRef.current.state.doc.length;
      viewRef.current.dispatch({
        changes: { from: 0, to: len, insert: initialCode },
      });
    }
    setCode(initialCode);
    writeLS(autosaveKey, initialCode);
  }

  function applyPreset(presetCode: string) {
    if (!viewRef.current) return;
    const len = viewRef.current.state.doc.length;
    viewRef.current.dispatch({
      changes: { from: 0, to: len, insert: presetCode },
    });
    setCode(presetCode);
  }

  // --- 上传文件 ---
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newOnes: UploadedFile[] = [];
    for (const file of Array.from(files)) {
      const kind = pickKind(file.name);
      if (!kind) {
        setOutputs((p) => [
          ...p,
          {
            type: "error",
            content: `不支持的文件格式：${file.name}（仅支持 CSV / XLSX / JSON）`,
          },
        ]);
        continue;
      }
      try {
        const data = await fileToBase64(file);
        newOnes.push({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          kind,
          size: file.size,
          data,
          createdAt: Date.now(),
        });
      } catch (err: any) {
        setOutputs((p) => [
          ...p,
          {
            type: "error",
            content: `读取 ${file.name} 失败：${err?.message || err}`,
          },
        ]);
      }
    }
    if (newOnes.length > 0) {
      setUploads((prev) => [...newOnes, ...prev]);
      setOutputs((p) => [
        ...p,
        {
          type: "info",
          content: `📂 已上传 ${newOnes.length} 个文件，下次运行时自动作为变量可用：\n  ${newOnes
            .map((u) => `${sanitizeVarName(u.name)} ← ${u.name}`)
            .join("\n  ")}`,
        },
      ]);
    }
    setUploading(false);
  }

  function removeUpload(id: string) {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }

  function insertUploadHints() {
    if (uploads.length === 0) return;
    const lines = uploads
      .map(
        (u) =>
          `# ${u.kind.toUpperCase()}: ${u.name} → 变量名 ${sanitizeVarName(u.name)}`
      )
      .join("\n");
    const insert = `\n# 你上传的数据集（下次运行前已自动加载）\n${lines}\n# 可以直接写：print(${sanitizeVarName(uploads[0].name)}.head())\n`;
    applyPreset(code + insert);
  }

  // --- 代码片段 ---
  function saveSnippet() {
    const name = snippetName.trim() || `片段 ${new Date().toLocaleString()}`;
    const now = Date.now();
    const s: Snippet = {
      id: `${now}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      code,
      createdAt: now,
      updatedAt: now,
    };
    setSnippets((prev) => [s, ...prev]);
    setSnippetName("");
    setSavingSnippet(false);
  }
  function loadSnippet(s: Snippet) {
    applyPreset(s.code);
    setShowSnippets(false);
  }
  function deleteSnippet(id: string) {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  }

  // --- 分享 ---
  function openShare() {
    setShareURL(toSharedURL(code));
    setShowShare(true);
    setCopied(false);
  }
  async function copyShare() {
    if (!shareURL) return;
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = shareURL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  // -------------------- 渲染 --------------------
  const fileIcon = (kind: UploadedFile["kind"]) => {
    if (kind === "csv") return <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />;
    if (kind === "xlsx") return <FileSpreadsheet className="h-3.5 w-3.5 text-sky-500" />;
    return <FileJson className="h-3.5 w-3.5 text-amber-500" />;
  };

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
          {savedAt && (
            <span className="hidden rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-emerald-300 md:inline">
              💾 {new Date(savedAt).toLocaleTimeString()} 自动保存
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* 模板 */}
          {!minimal && (
            <select
              onChange={(e) => {
                const t = CODE_TEMPLATES.find((x) => x.label === e.target.value);
                if (t) applyPreset(t.code);
                e.currentTarget.value = "";
              }}
              defaultValue=""
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-amber2-500 hover:text-amber2-500"
              title="插入常用模板"
            >
              <option value="" disabled>
                🪄 插入模板…
              </option>
              {CODE_TEMPLATES.map((t) => (
                <option key={t.label} value={t.label} className="text-ink-900">
                  {t.label}
                </option>
              ))}
            </select>
          )}

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

          {/* 上传 */}
          {!minimal && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json,text/csv,application/json"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-emerald-400 hover:text-emerald-400"
                title="上传 CSV / XLSX / JSON 文件，运行时自动解析为 pandas.DataFrame"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                上传数据集
              </button>
            </>
          )}

          {/* 保存到本地 */}
          {!minimal && (
            <button
              onClick={() => {
                setSavingSnippet(true);
                setSnippetName("");
              }}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-amber2-500 hover:text-amber2-500"
              title="保存当前代码到本地（浏览器 localStorage）"
            >
              <Save className="h-3.5 w-3.5" />
              保存
            </button>
          )}

          {/* 打开片段 */}
          {!minimal && (
            <button
              onClick={() => setShowSnippets(true)}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-amber2-500 hover:text-amber2-500"
              title={`打开已保存的代码（${snippets.length}）`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              打开
              {snippets.length > 0 && (
                <span className="rounded-full bg-amber2-500/20 px-1.5 text-[10px] text-amber2-300">
                  {snippets.length}
                </span>
              )}
            </button>
          )}

          {/* 分享 */}
          {!minimal && (
            <button
              onClick={openShare}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-violet-400 hover:text-violet-300"
              title="生成链接分享当前代码"
            >
              <Share2 className="h-3.5 w-3.5" />
              分享
            </button>
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
                ▶ 运行 (Ctrl+Enter)
              </>
            )}
          </button>
        </div>
      </div>

      {/* 保存片段弹层 */}
      {savingSnippet && (
        <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 bg-amber2-50/70 px-5 py-2">
          <span className="text-xs font-semibold text-amber2-700">保存到本地：</span>
          <input
            autoFocus
            value={snippetName}
            onChange={(e) => setSnippetName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveSnippet();
              if (e.key === "Escape") setSavingSnippet(false);
            }}
            placeholder="给这段代码起个名字…"
            className="flex-1 min-w-[180px] rounded-full border border-amber2-200 bg-white px-3 py-1.5 text-xs text-ink-800 outline-none focus:border-amber2-500"
          />
          <button
            onClick={saveSnippet}
            className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-ink-700"
          >
            <Check className="h-3.5 w-3.5" />
            保存
          </button>
          <button
            onClick={() => setSavingSnippet(false)}
            className="inline-flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600 transition hover:border-ink-400"
          >
            取消
          </button>
        </div>
      )}

      {/* 上传数据集区域 */}
      {!minimal && uploads.length > 0 && (
        <div className="border-b border-ink-100 bg-slate-50/60 px-5 py-2.5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-ink-500">
            <FileCode2 className="h-3.5 w-3.5 text-emerald-600" />
            我的数据集（下次运行自动载入为 Python 变量）
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {uploads.map((u) => (
              <div
                key={u.id}
                className="group inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] text-ink-700"
                title={`${u.kind.toUpperCase()} · ${(u.size / 1024).toFixed(1)} KB`}
              >
                {fileIcon(u.kind)}
                <span className="font-medium">{u.name}</span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-mono text-emerald-700">
                  {sanitizeVarName(u.name)}
                </span>
                <button
                  onClick={() => removeUpload(u.id)}
                  className="ml-1 text-ink-300 transition hover:text-red-500"
                  title="移除"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              onClick={insertUploadHints}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-ink-200 px-3 py-1 text-[11px] text-ink-500 transition hover:border-ink-500 hover:text-ink-700"
              title="在编辑器底部插入数据集变量提示"
            >
              <Wand2 className="h-3 w-3" />
              插入使用提示
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* 编辑器 */}
      <div
        ref={editorRef}
        style={{ height: `${height}px` }}
        className="relative bg-[#0B1120]"
      />

      {/* 底部快捷键提示 */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 bg-ink-900/95 px-5 py-2 text-[10px] text-ink-300">
        <span className="inline-flex flex-wrap items-center gap-2">
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-ink-100">Ctrl</kbd>
          <span>+</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-ink-100">Enter</kbd>
          <span>= 运行代码</span>
          <span className="mx-1 text-ink-600">·</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-ink-100">Ctrl</kbd>
          <span>+</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-ink-100">S</kbd>
          <span>= 手动保存</span>
          <span className="mx-1 text-ink-600">·</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-ink-100">Tab</kbd>
          <span>= 缩进</span>
          <span className="mx-1 text-ink-600">·</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-ink-100">Ctrl</kbd>
          <span>+</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-ink-100">Z</kbd>
          <span>= 撤销</span>
        </span>
        <span className="text-ink-500">
          代码会自动保存到浏览器 · 分享链接可直接打开他人代码
        </span>
      </div>

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
              还没有输出 —— 点右上角「▶ 运行代码」或按 Ctrl + Enter 试试吧
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
            if (o.type === "info") {
              return (
                <pre
                  key={i}
                  className="mb-2 whitespace-pre-wrap rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-[13px] leading-6 text-emerald-800"
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

      {/* 片段管理弹窗 */}
      {showSnippets && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-ink-900 to-slate-800 px-5 py-3 text-white">
              <span className="font-serif text-sm">📁 已保存代码（本地）</span>
              <button
                onClick={() => setShowSnippets(false)}
                className="rounded-full p-1 text-ink-200 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto p-4">
              {snippets.length === 0 ? (
                <div className="py-10 text-center text-sm text-ink-400">
                  还没有保存任何代码片段。写完代码后点「保存」即可。
                </div>
              ) : (
                <div className="space-y-2">
                  {snippets.map((s) => (
                    <div
                      key={s.id}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-ink-50/40 p-3 transition hover:border-amber2-300 hover:bg-amber2-50/40"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-ink-800">
                          {s.name}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-400">
                          <span>
                            {new Date(s.updatedAt).toLocaleString()}
                          </span>
                          <span>·</span>
                          <span>{s.code.length} 字符</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => loadSnippet(s)}
                          className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-ink-700"
                        >
                          <Clipboard className="h-3.5 w-3.5" />
                          载入
                        </button>
                        <button
                          onClick={() => deleteSnippet(s.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-500 transition hover:border-red-300 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 分享弹窗 */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 py-3 text-white">
              <span className="font-serif text-sm">🔗 分享当前代码</span>
              <button
                onClick={() => setShowShare(false)}
                className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm leading-6 text-ink-500">
                复制下面的链接分享给同学，对方打开后会直接载入你当前编辑的代码
                （代码存在 URL hash 中，不需要账号，不经过任何服务器）。
              </p>
              <div className="mt-4 flex items-stretch overflow-hidden rounded-2xl border border-ink-200">
                <input
                  readOnly
                  value={shareURL}
                  className="flex-1 bg-ink-50 px-3 py-2 font-mono text-[11px] text-ink-700 outline-none"
                />
                <button
                  onClick={copyShare}
                  className="inline-flex items-center gap-1 bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-ink-700"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      复制链接
                    </>
                  )}
                </button>
              </div>
              {fromSharedURL() && (
                <button
                  onClick={() => {
                    window.history.replaceState(null, "", location.pathname);
                    setShowShare(false);
                  }}
                  className="mt-3 text-xs text-ink-400 hover:text-ink-600"
                >
                  清除 URL 中的共享代码
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
