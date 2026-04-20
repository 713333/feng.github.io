import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Home, Book, Code, FileText, Trophy } from 'lucide-react';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <Book className="h-6 w-6" />
            <span>DataLearn</span>
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-orange-400 transition-colors">
              <Home className="h-5 w-5" />
              <span className="ml-1">首页</span>
            </Link>
            <Link to="/courses" className="hover:text-orange-400 transition-colors">
              <Book className="h-5 w-5" />
              <span className="ml-1">课程</span>
            </Link>
            <Link to="/practice" className="hover:text-orange-400 transition-colors">
              <Code className="h-5 w-5" />
              <span className="ml-1">练习</span>
            </Link>
            <Link to="/assessment" className="hover:text-orange-400 transition-colors">
              <FileText className="h-5 w-5" />
              <span className="ml-1">测评</span>
            </Link>
            <Link to="/achievements" className="hover:text-orange-400 transition-colors">
              <Trophy className="h-5 w-5" />
              <span className="ml-1">成就</span>
            </Link>
            

          </nav>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700 px-4 py-3">
            <nav className="flex flex-col gap-3">
              <Link to="/" className="py-2 hover:text-orange-400 transition-colors">首页</Link>
              <Link to="/courses" className="py-2 hover:text-orange-400 transition-colors">课程</Link>
              <Link to="/practice" className="py-2 hover:text-orange-400 transition-colors">练习</Link>
              <Link to="/assessment" className="py-2 hover:text-orange-400 transition-colors">测评</Link>
              <Link to="/achievements" className="py-2 hover:text-orange-400 transition-colors">成就</Link>
            </nav>
          </div>
        )}
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DataLearn</h3>
              <p className="text-gray-400">基于Python的数据分析在线教育平台，为商务数据分析与应用专业学生提供完整的学习体验。</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">首页</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">课程</Link></li>
                <li><Link to="/practice" className="text-gray-400 hover:text-white transition-colors">练习</Link></li>
                <li><Link to="/achievements" className="text-gray-400 hover:text-white transition-colors">成就</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">资源</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">常见问题</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">学习路径</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">社区论坛</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">联系我们</h4>
              <ul className="space-y-2 text-gray-400">
                <li>邮箱：contact@datalearn.com</li>
                <li>电话：123-456-7890</li>
                <li>地址：北京市海淀区教育创新中心</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© 2026 DataLearn. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
