import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, TrendingUp, PieChart, Database, ArrowLeft } from 'lucide-react';

const DataAnalysis = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // 模拟数据分析数据
    setData({
      sales: [
        { month: '1月', value: 12000 },
        { month: '2月', value: 19000 },
        { month: '3月', value: 15000 },
        { month: '4月', value: 25000 },
        { month: '5月', value: 22000 },
        { month: '6月', value: 30000 }
      ],
      customers: [
        { month: '1月', value: 120 },
        { month: '2月', value: 190 },
        { month: '3月', value: 150 },
        { month: '4月', value: 250 },
        { month: '5月', value: 220 },
        { month: '6月', value: 300 }
      ],
      products: [
        { name: '产品A', value: 40 },
        { name: '产品B', value: 30 },
        { name: '产品C', value: 20 },
        { name: '产品D', value: 10 }
      ]
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-1 text-blue-800 hover:text-blue-600">
          <ArrowLeft className="h-5 w-5" />
          <span>返回首页</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold">数据分析中心</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">销售趋势</h3>
              <p className="text-gray-600 text-sm">近6个月销售数据分析</p>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">销售趋势图表</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-800">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">客户增长</h3>
              <p className="text-gray-600 text-sm">近6个月客户数据</p>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">客户增长图表</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-800">
              <PieChart className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">产品分布</h3>
              <p className="text-gray-600 text-sm">产品销售占比分析</p>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">产品分布饼图</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">数据分析工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">数据清洗工具</h3>
            <p className="text-sm text-gray-600 mb-3">清洗和预处理数据</p>
            <button className="text-blue-800 hover:text-blue-600 text-sm font-medium">
              开始使用
            </button>
          </div>
          <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">数据可视化工具</h3>
            <p className="text-sm text-gray-600 mb-3">创建交互式图表</p>
            <button className="text-blue-800 hover:text-blue-600 text-sm font-medium">
              开始使用
            </button>
          </div>
          <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">统计分析工具</h3>
            <p className="text-sm text-gray-600 mb-3">进行统计分析</p>
            <button className="text-blue-800 hover:text-blue-600 text-sm font-medium">
              开始使用
            </button>
          </div>
          <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">预测分析工具</h3>
            <p className="text-sm text-gray-600 mb-3">预测未来趋势</p>
            <button className="text-blue-800 hover:text-blue-600 text-sm font-medium">
              开始使用
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">数据分析案例</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">电商销售数据分析</h3>
            <p className="text-sm text-gray-600 mb-3">分析电商平台销售数据，识别热销产品和销售趋势</p>
            <button className="text-blue-800 hover:text-blue-600 text-sm font-medium">
              查看案例
            </button>
          </div>
          <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">用户行为分析</h3>
            <p className="text-sm text-gray-600 mb-3">分析用户行为数据，优化产品体验</p>
            <button className="text-blue-800 hover:text-blue-600 text-sm font-medium">
              查看案例
            </button>
          </div>
          <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2">财务数据分析</h3>
            <p className="text-sm text-gray-600 mb-3">分析财务数据，提供决策支持</p>
            <button className="text-blue-800 hover:text-blue-600 text-sm font-medium">
              查看案例
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;
