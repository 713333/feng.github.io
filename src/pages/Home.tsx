import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Book, Code, BarChart2, Database, TrendingUp, Award, ArrowRight } from 'lucide-react';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    // 模拟课程数据
    setCourses([
      {
        id: '1',
        title: 'Python数据分析基础',
        description: '掌握Python数据分析的核心概念和基础库',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover&image_size=landscape_16_9',
        difficulty: '初级',
        duration: 12
      },
      {
        id: '2',
        title: 'Pandas数据处理',
        description: '深入学习Pandas库，掌握数据清洗和转换技巧',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Pandas%20data%20processing%20course%20cover&image_size=landscape_16_9',
        difficulty: '中级',
        duration: 16
      },
      {
        id: '3',
        title: 'Matplotlib数据可视化',
        description: '学习使用Matplotlib创建专业的数据可视化图表',
        cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20with%20Matplotlib%20course%20cover&image_size=landscape_16_9',
        difficulty: '中级',
        duration: 14
      }
    ]);

    // 模拟分类数据
    setCategories([
      {
        id: '1',
        name: '基础入门',
        icon: <Book className="h-8 w-8" />,
        description: 'Python基础和数据分析入门课程'
      },
      {
        id: '2',
        name: '数据处理',
        icon: <Database className="h-8 w-8" />,
        description: 'Pandas、NumPy等数据处理库'
      },
      {
        id: '3',
        name: '数据可视化',
        icon: <BarChart2 className="h-8 w-8" />,
        description: 'Matplotlib、Seaborn等可视化工具'
      },
      {
        id: '4',
        name: '机器学习',
        icon: <TrendingUp className="h-8 w-8" />,
        description: 'Scikit-learn等机器学习库'
      }
    ]);

    // 模拟学习进度
    setProgress(35);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero区域 */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            掌握Python数据分析，开启数据驱动未来
          </h1>
          <p className="text-lg mb-6">
            DataLearn为商务数据分析与应用专业学生提供完整的课程体系，从基础到进阶，助你成为数据分析专家。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/courses" 
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              浏览课程
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-blue-800 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
            >
              免费注册
            </Link>
          </div>
        </div>
      </section>

      {/* 平台特色 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">平台特色</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-blue-800" />
            </div>
            <h3 className="text-lg font-semibold mb-2">完整课程体系</h3>
            <p className="text-gray-600">从Python基础到高级数据分析，覆盖商务数据分析的全流程技能。</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-blue-800" />
            </div>
            <h3 className="text-lg font-semibold mb-2">互动式学习</h3>
            <p className="text-gray-600">在线代码编辑器，实时运行和反馈，提升实践能力。</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-blue-800" />
            </div>
            <h3 className="text-lg font-semibold mb-2">成就激励系统</h3>
            <p className="text-gray-600">通过徽章、排行榜等激励机制，保持学习动力。</p>
          </div>
        </div>
      </section>

      {/* 课程分类 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">课程分类</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/courses?category=${category.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="text-blue-800 mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新课程 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">最新课程</h2>
          <Link to="/courses" className="text-blue-800 hover:text-blue-600 flex items-center gap-1">
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
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
                  <span className="text-gray-500 text-sm">{course.duration} 小时</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <button className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded transition-colors">
                  开始学习
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 学习进度 */}
      {user && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">学习进度</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1E40AF"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 283}`}
                  strokeDashoffset="283"
                  className="transition-all duration-1000 ease-in-out"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{progress}%</span>
                <span className="text-sm text-gray-500">已完成</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">最近学习</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                    <Book className="h-6 w-6 text-blue-800" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Python数据分析基础</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-blue-800 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                    <Database className="h-6 w-6 text-blue-800" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Pandas数据处理</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-blue-800 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
