import React from 'react';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: '1',
    title: '项目1：数据基础与环境搭建',
    description: '学习Python数据分析的基础环境搭建，包括Pyodide的使用和基本数据结构',
    level: '入门'
  },
  {
    id: '2',
    title: '项目2：数据清洗与预处理',
    description: '掌握数据清洗的基本技巧，包括缺失值处理、异常值检测和数据转换',
    level: '入门'
  },
  {
    id: '3',
    title: '项目3：数据可视化基础',
    description: '学习使用Matplotlib和Seaborn创建基本的数据可视化图表',
    level: '入门'
  },
  {
    id: '4',
    title: '项目4：探索性数据分析',
    description: '掌握探索性数据分析的方法，包括描述性统计和数据分布分析',
    level: '进阶'
  },
  {
    id: '5',
    title: '项目5：假设检验',
    description: '学习统计假设检验的基本原理和应用方法',
    level: '进阶'
  },
  {
    id: '6',
    title: '项目6：回归分析',
    description: '掌握线性回归和逻辑回归的原理和实现方法',
    level: '进阶'
  },
  {
    id: '7',
    title: '项目7：分类算法',
    description: '学习常见的分类算法，如决策树、随机森林和支持向量机',
    level: '高级'
  },
  {
    id: '8',
    title: '项目8：聚类分析',
    description: '掌握聚类分析的基本原理和应用方法',
    level: '高级'
  },
  {
    id: '9',
    title: '项目9：时间序列分析',
    description: '学习时间序列分析的基本方法和预测技术',
    level: '高级'
  },
  {
    id: '10',
    title: '项目10：综合项目实战',
    description: '运用所学知识完成一个综合的数据分析项目',
    level: '专家'
  }
];

const Projects: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">10个梯度项目</h1>
        <p className="text-lg text-gray-600">通过实际项目练习，掌握Python数据分析的核心技能</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{project.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.level === '入门' ? 'bg-green-100 text-green-800' :
                  project.level === '进阶' ? 'bg-blue-100 text-blue-800' :
                  project.level === '高级' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.level}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-end">
                <span className="text-blue-600 font-medium flex items-center">
                  开始学习
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;