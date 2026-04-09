import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, FileText, ArrowLeft } from 'lucide-react';

const AssessmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60分钟

  useEffect(() => {
    // 模拟测评详情数据
    setAssessment({
      id: id,
      title: 'Pandas章节测评',
      description: '测试Pandas库的核心概念和操作',
      difficulty: '中级',
      course: 'Python数据分析基础',
      duration: 60,
      questions: 20,
      passing_score: 60,
      questionsList: [
        {
          id: 1,
          type: 'multiple-choice',
          question: '以下哪个是Pandas中用于创建数据框的函数？',
          options: ['pd.array()', 'pd.DataFrame()', 'pd.series()', 'pd.data()'],
          correctAnswer: 'pd.DataFrame()'
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'Pandas中用于读取CSV文件的函数是？',
          options: ['read_csv()', 'load_csv()', 'import_csv()', 'csv_read()'],
          correctAnswer: 'read_csv()'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'Pandas中的Series是一维数据结构。',
          options: ['正确', '错误'],
          correctAnswer: '正确'
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: '以下哪个方法用于查看DataFrame的前几行数据？',
          options: ['head()', 'top()', 'first()', 'view()'],
          correctAnswer: 'head()'
        },
        {
          id: 5,
          type: 'multiple-choice',
          question: 'Pandas中用于处理缺失值的方法是？',
          options: ['drop_null()', 'remove_na()', 'dropna()', 'clean_data()'],
          correctAnswer: 'dropna()'
        }
      ]
    });
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    // 计算分数
    let totalScore = 0;
    assessment.questionsList.forEach((question: any) => {
      if (answers[question.id] === question.correctAnswer) {
        totalScore += 100 / assessment.questionsList.length;
      }
    });
    setScore(Math.round(totalScore));
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questionsList.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (!assessment) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p>加载中...</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = assessment.questionsList[currentQuestion];
  const isCorrect = isSubmitted && answers[currentQ.id] === currentQ.correctAnswer;
  const isIncorrect = isSubmitted && answers[currentQ.id] !== currentQ.correctAnswer;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/assessment" className="flex items-center gap-1 text-blue-800 hover:text-blue-600">
          <ArrowLeft className="h-5 w-5" />
          <span>返回测评列表</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* 测评头部 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${assessment.difficulty === '初级' ? 'bg-green-100 text-green-800' : assessment.difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {assessment.difficulty}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {assessment.course}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">时间:</span>
              <span className={`font-medium ${timeLeft < 600 ? 'text-red-600' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">题目:</span>
              <span className="font-medium">
                {currentQuestion + 1}/{assessment.questionsList.length}
              </span>
            </div>
          </div>
        </div>

        {/* 答题区域 */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">第 {currentQuestion + 1} 题</h2>
            <p className="text-gray-800 mb-4">{currentQ.question}</p>
            <div className="space-y-3">
              {currentQ.options.map((option: string, index: number) => (
                <div key={index}>
                  <label className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-colors ${isSubmitted ? (option === currentQ.correctAnswer ? 'bg-green-50 border-green-200' : isIncorrect && answers[currentQ.id] === option ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200') : answers[currentQ.id] === option ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option}
                      checked={answers[currentQ.id] === option}
                      onChange={() => handleAnswerChange(currentQ.id, option)}
                      disabled={isSubmitted}
                      className="w-4 h-4"
                    />
                    <span>{option}</span>
                    {isSubmitted && option === currentQ.correctAnswer && (
                      <Check className="ml-auto h-5 w-5 text-green-500" />
                    )}
                    {isSubmitted && isIncorrect && answers[currentQ.id] === option && (
                      <X className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </label>
                </div>
              ))}
            </div>
            {isSubmitted && isIncorrect && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">
                  <strong>正确答案:</strong> {currentQ.correctAnswer}
                </p>
              </div>
            )}
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一题
            </button>
            {currentQuestion === assessment.questionsList.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交测评
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                下一题
              </button>
            )}
          </div>
        </div>

        {/* 提交结果 */}
        {isSubmitted && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4">测评结果</h2>
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 mb-4">
                <span className="text-4xl font-bold text-blue-800">{score}%</span>
              </div>
              <p className={`text-lg font-medium ${score >= assessment.passing_score ? 'text-green-600' : 'text-red-600'}`}>
                {score >= assessment.passing_score ? '恭喜你通过了测评！' : '很遗憾，未通过测评，请再接再厉。'}
              </p>
              <p className="text-gray-600 mt-2">
                及格分数: {assessment.passing_score}%
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md text-center">
                <p className="text-gray-500 mb-1">总题目数</p>
                <p className="text-xl font-semibold">{assessment.questionsList.length}</p>
              </div>
              <div className="bg-white p-4 rounded-md text-center">
                <p className="text-gray-500 mb-1">正确题数</p>
                <p className="text-xl font-semibold text-green-600">
                  {assessment.questionsList.filter((q: any) => answers[q.id] === q.correctAnswer).length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-md text-center">
                <p className="text-gray-500 mb-1">错误题数</p>
                <p className="text-xl font-semibold text-red-600">
                  {assessment.questionsList.filter((q: any) => answers[q.id] !== q.correctAnswer).length}
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link 
                to="/assessment"
                className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                返回测评列表
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetail;
