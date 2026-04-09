import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Filter, ChevronDown, Search } from 'lucide-react';

const Assessment = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<any[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // 模拟测评数据
    setAssessments([
      {
        id: '3-5',
        title: 'Pandas章节测评',
        description: '测试Pandas库的核心概念和操作',
        difficulty: '中级',
        course: 'Python数据分析基础',
        duration: 60,
        questions: 20,
        passing_score: 60,
        completed: false
      },
      {
        id: '4-5',
        title: 'Matplotlib章节测评',
        description: '测试Matplotlib数据可视化能力',
        difficulty: '中级',
        course: 'Matplotlib数据可视化',
        duration: 45,
        questions: 15,
        passing_score: 60,
        completed: false
      },
      {
        id: '5-5',
        title: 'Seaborn章节测评',
        description: '测试Seaborn高级可视化技巧',
        difficulty: '高级',
        course: 'Seaborn高级可视化',
        duration: 50,
        questions: 18,
        passing_score: 65,
        completed: false
      },
      {
        id: '6-5',
        title: 'Python数据分析综合测评',
        description: '综合测试Python数据分析的各项技能',
        difficulty: '高级',
        course: 'Python数据分析基础',
        duration: 90,
        questions: 30,
        passing_score: 70,
        completed: false
      }
    ]);
  }, []);

  useEffect(() => {
    let result = [...assessments];

    // 按难度筛选
    if (selectedDifficulty !== 'all') {
      result = result.filter(assessment => assessment.difficulty === selectedDifficulty);
    }

    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(assessment => 
        assessment.title.toLowerCase().includes(query) ||
        assessment.description.toLowerCase().includes(query) ||
        assessment.course.toLowerCase().includes(query)
      );
    }

    setFilteredAssessments(result);
  }, [assessments, selectedDifficulty, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">测评中心</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索测评..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>筛选</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10">
                <div>
                  <h3 className="font-medium mb-2">难度</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="difficulty"
                        value="all"
                        checked={selectedDifficulty === 'all'}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      />
                      <span>全部</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="difficulty"
                        value="初级"
                        checked={selectedDifficulty === '初级'}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      />
                      <span>初级</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="difficulty"
                        value="中级"
                        checked={selectedDifficulty === '中级'}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      />
                      <span>中级</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="difficulty"
                        value="高级"
                        checked={selectedDifficulty === '高级'}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      />
                      <span>高级</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 测评列表 */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Link
              key={assessment.id}
              to={`/assessment/${assessment.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${assessment.difficulty === '初级' ? 'bg-green-100 text-green-800' : assessment.difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {assessment.difficulty}
                      </span>
                    </div>
                  </div>
                  {assessment.completed && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      已完成
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{assessment.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-xs">时长</p>
                    <p className="font-medium">{assessment.duration} 分钟</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-xs">题目数</p>
                    <p className="font-medium">{assessment.questions} 题</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-xs">及格分数</p>
                    <p className="font-medium">{assessment.passing_score}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-xs">课程</p>
                    <p className="font-medium text-sm">{assessment.course}</p>
                  </div>
                </div>
                <button className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded transition-colors">
                  开始测评
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">暂无测评</h3>
          <p className="text-gray-600">请尝试调整筛选条件或搜索其他测评</p>
        </div>
      )}
    </div>
  );
};

export default Assessment;
