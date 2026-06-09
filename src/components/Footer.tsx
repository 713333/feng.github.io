export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white/70 py-10 text-sm text-ink-500">
      <div className="container flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="font-serif text-lg text-ink-900">PyDataLab</p>
          <p className="text-xs text-ink-500">
            面向大学生的免费 pandas 数据分析实训平台 · 让每个同学都能拥有「真实项目经验」。
          </p>
        </div>
        <div className="text-xs text-ink-500">
          数据集版权归原作者所有 · 本项目仅用于学习与教学
        </div>
      </div>
    </footer>
  );
}
