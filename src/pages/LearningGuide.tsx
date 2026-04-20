import { Link } from 'react-router-dom';

const LearningGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-center mb-12">学习引导</h1>

        {/* 3步认知模块 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">3步认知</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">思维模型</h3>
              <p className="text-gray-600 mb-4">
                建立数据分析的核心思维框架，理解数据驱动决策的本质
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 数据思维的核心要素</li>
                <li>• 分析方法与工具选择</li>
                <li>• 结果解读与决策应用</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">行业争议</h3>
              <p className="text-gray-600 mb-4">
                了解数据分析领域的常见争议和不同观点
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 数据质量与分析结果的关系</li>
                <li>• 统计显著性与实际意义</li>
                <li>• 自动化与人工分析的平衡</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">辨析题</h3>
              <p className="text-gray-600 mb-4">
                通过实际问题检验你的数据分析思维
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 案例分析与判断</li>
                <li>• 常见错误识别</li>
                <li>• AI纠错与提升</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 学习路径 */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">学习路径</h2>
          <div className="relative">
            {/* 连接线 */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2"></div>
            
            {/* 步骤1 */}
            <div className="flex flex-col md:flex-row items-center mb-12 relative">
              <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">第一步：基础认知</h3>
                <p className="text-gray-600">
                  完成3步认知模块，建立数据分析的思维框架
                </p>
              </div>
              <div className="z-10 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div className="md:w-1/2 md:pl-12"></div>
            </div>
            
            {/* 步骤2 */}
            <div className="flex flex-col md:flex-row items-center mb-12 relative">
              <div className="md:w-1/2 md:pr-12"></div>
              <div className="z-10 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div className="md:w-1/2 md:pl-12 mt-4 md:mt-0">
                <h3 className="text-xl font-semibold mb-2">第二步：项目实践</h3>
                <p className="text-gray-600">
                  完成10个梯度项目，从基础到进阶
                </p>
              </div>
            </div>
            
            {/* 步骤3 */}
            <div className="flex flex-col md:flex-row items-center relative">
              <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">第三步：能力提升</h3>
                <p className="text-gray-600">
                  通过AI错题倒逼，不断提升分析能力
                </p>
              </div>
              <div className="z-10 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div className="md:w-1/2 md:pl-12"></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">准备好开始了吗？</h2>
          <p className="text-lg text-gray-600 mb-8">
            开始你的数据分析之旅，从第一个项目开始
          </p>
          <Link
            to="/projects"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            查看项目列表
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearningGuide;
