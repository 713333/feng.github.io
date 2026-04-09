import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Book, Filter, ChevronDown, Search } from 'lucide-react';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // 模拟课程数据
    setCourses([
      {
        id: '1',
        title: 'Python数据分析基础',
        description: '掌握Python数据分析的核心概念和基础库',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover&image_size=landscape_16_9',
        difficulty: '初级',
        category: '基础入门',
        duration: 12,
        rating: 4.8
      },
      {
        id: '2',
        title: 'Pandas数据处理',
        description: '深入学习Pandas库，掌握数据清洗和转换技巧',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Pandas%20data%20processing%20course%20cover&image_size=landscape_16_9',
        difficulty: '中级',
        category: '数据处理',
        duration: 16,
        rating: 4.9
      },
      {
        id: '3',
        title: 'Matplotlib数据可视化',
        description: '学习使用Matplotlib创建专业的数据可视化图表',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20with%20Matplotlib%20course%20cover&image_size=landscape_16_9',
        difficulty: '中级',
        category: '数据可视化',
        duration: 14,
        rating: 4.7
      },
      {
        id: '4',
        title: 'Seaborn高级可视化',
        description: '使用Seaborn创建更美观、更专业的数据可视化',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Seaborn%20data%20visualization%20course%20cover&image_size=landscape_16_9',
        difficulty: '高级',
        category: '数据可视化',
        duration: 18,
        rating: 4.9
      },
      {
        id: '5',
        title: 'NumPy科学计算',
        description: '掌握NumPy库的核心功能，用于高效的数值计算',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=NumPy%20scientific%20computing%20course%20cover&image_size=landscape_16_9',
        difficulty: '中级',
        category: '数据处理',
        duration: 15,
        rating: 4.6
      },
      {
        id: '6',
        title: 'Scikit-learn机器学习基础',
        description: '入门机器学习，使用Scikit-learn构建预测模型',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Machine%20learning%20with%20Scikit-learn%20course%20cover&image_size=landscape_16_9',
        difficulty: '高级',
        category: '机器学习',
        duration: 20,
        rating: 4.8
      }
    ]);

    // 模拟分类数据
    setCategories([
      { id: 'all', name: '全部' },
      { id: '基础入门', name: '基础入门' },
      { id: '数据处理', name: '数据处理' },
      { id: '数据可视化', name: '数据可视化' },
      { id: '机器学习', name: '机器学习' }
    ]);
  }, []);

  useEffect(() => {
    let result = [...courses];

    // 按分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // 按难度筛选
    if (selectedDifficulty !== 'all') {
      result = result.filter(course => course.difficulty === selectedDifficulty);
    }

    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(result);
  }, [courses, selectedCategory, selectedDifficulty, searchQuery]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">课程列表</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索课程..."
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

      {/* 分类导航 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id 
                ? 'bg-blue-800 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 课程列表 */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={course.cover_image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {course.difficulty}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{course.duration} 小时</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    {course.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">暂无课程</h3>
          <p className="text-gray-600">请尝试调整筛选条件或搜索其他课程</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
