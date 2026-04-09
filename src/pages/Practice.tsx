import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, BarChart2, FileText, Filter, ChevronDown, Search } from 'lucide-react';

const Practice = () => {
  const [practices, setPractices] = useState<any[]>([]);
  const [filteredPractices, setFilteredPractices] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // 模拟练习数据
    setPractices([
      {
        id: '1-4',
        title: 'Python基础练习',
        description: '练习Python基本语法和数据类型',
        type: '编程练习',
        difficulty: '初级',
        course: 'Python数据分析基础',
        duration: 30,
        completed: false
      },
      {
        id: '2-3',
        title: 'NumPy练习',
        description: '练习NumPy数组操作和数值计算',
        type: '编程练习',
        difficulty: '初级',
        course: 'Python数据分析基础',
        duration: 35,
        completed: false
      },
      {
        id: '3-4',
        title: 'Pandas练习',
        description: '练习Pandas数据清洗和转换',
        type: '编程练习',
        difficulty: '中级',
        course: 'Python数据分析基础',
        duration: 40,
        completed: false
      },
      {
        id: '4-1',
        title: 'Matplotlib可视化练习',
        description: '使用Matplotlib创建各种数据可视化图表',
        type: '数据可视化',
        difficulty: '中级',
        course: 'Matplotlib数据可视化',
        duration: 45,
        completed: false
      },
      {
        id: '5-1',
        title: 'Seaborn高级可视化练习',
        description: '使用Seaborn创建更美观的可视化图表',
        type: '数据可视化',
        difficulty: '高级',
        course: 'Seaborn高级可视化',
        duration: 50,
        completed: false
      },
      {
        id: '6-1',
        title: '销售数据分析案例',
        description: '分析销售数据，识别趋势和机会',
        type: '案例分析',
        difficulty: '中级',
        course: 'Python数据分析基础',
        duration: 60,
        completed: false
      }
    ]);
  }, []);

  useEffect(() => {
    let result = [...practices];

    // 按类型筛选
    if (selectedType !== 'all') {
      result = result.filter(practice => practice.type === selectedType);
    }

    // 按难度筛选
    if (selectedDifficulty !== 'all') {
      result = result.filter(practice => practice.difficulty === selectedDifficulty);
    }

    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(practice => 
        practice.title.toLowerCase().includes(query) ||
        practice.description.toLowerCase().includes(query) ||
        practice.course.toLowerCase().includes(query)
      );
    }

    setFilteredPractices(result);
  }, [practices, selectedType, selectedDifficulty, searchQuery]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '编程练习':
        return <Code className="h-5 w-5" />;
      case '数据可视化':
        return <BarChart2 className="h-5 w-5" />;
      case '案例分析':
        return <FileText className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">练习中心</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索练习..."
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
                <div className="mb-4">
                  <h3 className="font-medium mb-2">练习类型</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="all"
                        checked={selectedType === 'all'}
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span>全部</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="编程练习"
                        checked={selectedType === '编程练习'}
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span>编程练习</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="数据可视化"
                        checked={selectedType === '数据可视化'}
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span>数据可视化</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="案例分析"
                        checked={selectedType === '案例分析'}
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span>案例分析</span>
                    </label>
                  </div>
                </div>
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

      {/* 练习列表 */}
      {filteredPractices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPractices.map((practice) => (
            <Link
              key={practice.id}
              to={`/practice/${practice.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
                      {getTypeIcon(practice.type)}
                    </div>
                    <div>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        {practice.type}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${practice.difficulty === '初级' ? 'bg-green-100 text-green-800' : practice.difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {practice.difficulty}
                      </span>
                    </div>
                  </div>
                  {practice.completed && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      已完成
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{practice.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{practice.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{practice.course}</span>
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <span>{practice.duration} 分钟</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">暂无练习</h3>
          <p className="text-gray-600">请尝试调整筛选条件或搜索其他练习</p>
        </div>
      )}
    </div>
  );
};

export default Practice;
