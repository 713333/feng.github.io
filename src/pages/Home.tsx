import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Python数据分析AI训练平台
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            基于Cloudflare免费资源，实现「3步认知+10个梯度项目+AI错题倒逼」的Python数据分析实操训练
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/guide"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              开始学习
            </Link>
            <Link
              to="/projects"
              className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              查看项目
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">平台特色</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">无后端架构</h3>
              <p className="text-gray-600">
                完全基于Cloudflare免费资源，无需传统后端服务器，打开浏览器即可使用
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">AI陪练</h3>
              <p className="text-gray-600">
                内置AI教练，提供思路点拨、代码纠错，严格遵循教学规范
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">10个梯度项目</h3>
              <p className="text-gray-600">
                从基础到进阶的10个真实数据分析项目，涵盖不同行业场景
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">技术栈</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">前端技术</h3>
              <ul className="space-y-2 text-gray-600">
                <li>React 18 + TypeScript</li>
                <li>Vite + Tailwind CSS</li>
                <li>Monaco Editor（代码编辑器）</li>
                <li>Recharts（图表渲染）</li>
                <li>Pyodide（浏览器端Python）</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Cloudflare服务</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Cloudflare Pages（前端部署）</li>
                <li>Cloudflare Workers（AI代理）</li>
                <li>Workers KV（静态内容存储）</li>
                <li>Cloudflare AI Gateway（AI API管理）</li>
                <li>LocalStorage（本地数据存储）</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">开始你的数据分析之旅</h2>
          <p className="text-xl mb-8">
            零成本、零运维，打开浏览器即可开始学习Python数据分析
          </p>
          <Link
            to="/guide"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            立即开始
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
