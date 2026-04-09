import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Play, Check, Book, Code, FileText } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 模拟课程详情数据
    setCourse({
      id: id,
      title: 'Python数据分析基础',
      description: '本课程将带你从零开始学习Python数据分析，掌握核心概念和基础库的使用。通过实际案例和动手练习，你将学会如何使用Python处理和分析数据，为商务决策提供支持。',
      cover_image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover&image_size=landscape_16_9',
      difficulty: '初级',
      category: '基础入门',
      duration: 12,
      rating: 4.8,
      instructor: '张教授',
      instructor_bio: '数据分析专家，拥有10年教学经验，曾在多家企业担任数据分析师。',
      start_date: '2026-01-15',
      chapters: [
        {
          id: '1',
          title: 'Python基础',
          lessons: [
            {
              id: '1-1',
              title: 'Python简介与环境搭建',
              type: 'video',
              duration: '45分钟',
              completed: false
            },
            {
              id: '1-2',
              title: 'Python基本语法',
              type: 'video',
              duration: '60分钟',
              completed: false
            },
            {
              id: '1-3',
              title: 'Python数据类型',
              type: 'video',
              duration: '50分钟',
              completed: false
            },
            {
              id: '1-4',
              title: 'Python基础练习',
              type: 'exercise',
              duration: '30分钟',
              completed: false
            }
          ]
        },
        {
          id: '2',
          title: 'NumPy库',
          lessons: [
            {
              id: '2-1',
              title: 'NumPy简介',
              type: 'video',
              duration: '40分钟',
              completed: false
            },
            {
              id: '2-2',
              title: 'NumPy数组操作',
              type: 'video',
              duration: '55分钟',
              completed: false
            },
            {
              id: '2-3',
              title: 'NumPy练习',
              type: 'exercise',
              duration: '35分钟',
              completed: false
            }
          ]
        },
        {
          id: '3',
          title: 'Pandas库',
          lessons: [
            {
              id: '3-1',
              title: 'Pandas简介',
              type: 'video',
              duration: '45分钟',
              completed: false
            },
            {
              id: '3-2',
              title: 'Series和DataFrame',
              type: 'video',
              duration: '60分钟',
              completed: false
            },
            {
              id: '3-3',
              title: '数据清洗与转换',
              type: 'video',
              duration: '55分钟',
              completed: false
            },
            {
              id: '3-4',
              title: 'Pandas练习',
              type: 'exercise',
              duration: '40分钟',
              completed: false
            },
            {
              id: '3-5',
              title: '章节测评',
              type: 'assessment',
              duration: '60分钟',
              completed: false
            }
          ]
        }
      ]
    });
  }, [id]);

  const toggleChapter = (chapterId: string) => {
    const newExpandedChapters = new Set(expandedChapters);
    if (newExpandedChapters.has(chapterId)) {
      newExpandedChapters.delete(chapterId);
    } else {
      newExpandedChapters.add(chapterId);
    }
    setExpandedChapters(newExpandedChapters);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'exercise':
        return <Code className="h-4 w-4" />;
      case 'assessment':
        return <FileText className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  if (!course) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 课程头部 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={course.cover_image} 
              alt={course.title} 
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.difficulty}
                </span>
                <span className="ml-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {course.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{course.rating}</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-500 text-sm">总时长</p>
                <p className="font-medium">{course.duration} 小时</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-500 text-sm">章节数</p>
                <p className="font-medium">{course.chapters.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-500 text-sm">开始日期</p>
                <p className="font-medium">{course.start_date}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-500 text-sm">讲师</p>
                <p className="font-medium">{course.instructor}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex-1">
                开始学习
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition-colors">
                加入收藏
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 讲师信息 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">讲师信息</h2>
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-800 font-bold text-xl">{course.instructor.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{course.instructor}</h3>
            <p className="text-gray-600">{course.instructor_bio}</p>
          </div>
        </div>
      </div>

      {/* 课程大纲 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">课程大纲</h2>
        <div className="space-y-4">
          {course.chapters.map((chapter: any) => (
            <div key={chapter.id} className="border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="font-medium">{chapter.title}</span>
                {expandedChapters.has(chapter.id) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
              {expandedChapters.has(chapter.id) && (
                <div className="p-4 border-t border-gray-200">
                  <div className="space-y-2">
                    {chapter.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                          {getLessonIcon(lesson.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{lesson.title}</span>
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Link to={`/practice/${lesson.id}`} className="text-blue-800 hover:text-blue-600">
                              开始
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 课程评价 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">课程评价</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-medium">李</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">李同学</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">课程内容非常丰富，老师讲解清晰，练习也很有针对性，收获很大！</p>
              <p className="text-sm text-gray-500 mt-1">2026-01-20</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-medium">王</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">王同学</span>
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                  <span className="text-gray-300">★</span>
                </div>
              </div>
              <p className="text-gray-600">作为零基础学员，这个课程非常适合我，循序渐进，容易理解。</p>
              <p className="text-sm text-gray-500 mt-1">2026-01-18</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
