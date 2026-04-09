import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Check, X, Code, Book, ArrowLeft } from 'lucide-react';

const PracticeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [practice, setPractice] = useState<any>(null);
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPassed, setIsPassed] = useState<boolean | null>(null);

  useEffect(() => {
    // 模拟练习详情数据
    setPractice({
      id: id,
      title: 'Python基础练习',
      description: '练习Python基本语法和数据类型，完成以下任务：\n1. 创建一个函数，计算两个数的和\n2. 使用列表推导式生成1-10的平方\n3. 编写一个简单的条件判断语句',
      type: '编程练习',
      difficulty: '初级',
      course: 'Python数据分析基础',
      duration: 30,
      test_cases: [
        {
          input: 'add(2, 3)',
          expected: '5'
        },
        {
          input: 'squares',
          expected: '[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]'
        }
      ],
      hints: [
        '使用def关键字定义函数',
        '列表推导式的语法：[expression for item in iterable]',
        '条件判断使用if-else语句'
      ]
    });

    // 初始代码模板
    setCode(`# 任务1: 创建一个函数，计算两个数的和
def add(a, b):
    return a + b

# 任务2: 使用列表推导式生成1-10的平方
squares = [i**2 for i in range(1, 11)]

# 任务3: 编写一个简单的条件判断语句
x = 10
if x > 5:
    print("x大于5")
else:
    print("x小于等于5")

# 测试代码
print(add(2, 3))
print(squares)
`);
  }, [id]);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('运行中...');
    setIsPassed(null);

    // 模拟代码运行
    setTimeout(() => {
      const mockOutput = `5
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
x大于5`;
      setOutput(mockOutput);
      setIsPassed(true);
      setIsRunning(false);
    }, 1000);
  };

  if (!practice) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/practice" className="flex items-center gap-1 text-blue-800 hover:text-blue-600">
          <ArrowLeft className="h-5 w-5" />
          <span>返回练习列表</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{practice.title}</h1>
            <div className="flex gap-2">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                {practice.type}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${practice.difficulty === '初级' ? 'bg-green-100 text-green-800' : practice.difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {practice.difficulty}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {practice.course}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>{practice.duration} 分钟</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">练习描述</h2>
          <pre className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap">
            {practice.description}
          </pre>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">代码编辑器</h2>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <Editor
              height="400px"
              language="python"
              value={code}
              onChange={(value) => value && setCode(value)}
              options={{
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 4
              }}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4" />
              {isRunning ? '运行中...' : '运行代码'}
            </button>
            <button
              className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors"
            >
              <Book className="h-4 w-4" />
              查看提示
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">运行结果</h2>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2">
              <Code className="h-4 w-4 text-gray-600" />
              <span className="font-medium">输出</span>
            </div>
            <div className="p-4 bg-gray-50 min-h-[200px] font-mono text-sm">
              {output}
            </div>
          </div>
          {isPassed !== null && (
            <div className={`mt-4 p-3 rounded-md flex items-center gap-2 ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isPassed ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>恭喜！所有测试用例都通过了。</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5" />
                  <span>测试用例未通过，请检查代码。</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">测试用例</h2>
          <div className="space-y-3">
            {practice.test_cases.map((testCase: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">测试用例 {index + 1}</span>
                  {isPassed && <Check className="h-5 w-5 text-green-500" />}
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">输入:</span>
                    <pre className="mt-1 p-2 bg-white border border-gray-200 rounded text-sm">{testCase.input}</pre>
                  </div>
                  <div>
                    <span className="text-gray-600">期望输出:</span>
                    <pre className="mt-1 p-2 bg-white border border-gray-200 rounded text-sm">{testCase.expected}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">提示</h2>
          <div className="bg-blue-50 p-4 rounded-md">
            <ul className="list-disc pl-5 space-y-1 text-blue-800">
              {practice.hints.map((hint: string, index: number) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeDetail;
