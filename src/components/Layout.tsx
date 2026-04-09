import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Menu, X, User, LogOut, Home, Book, Code, FileText, Trophy, UserCircle } from 'lucide-react';

const Layout = () => {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

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
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                  <UserCircle className="h-5 w-5" />
                  <span>{user.email.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">个人中心</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>退出登录</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-orange-400 transition-colors">登录</Link>
                <Link to="/register" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-colors">注册</Link>
              </div>
            )}
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
              {user ? (
                <>
                  <Link to="/profile" className="py-2 hover:text-orange-400 transition-colors">个人中心</Link>
                  <button onClick={handleLogout} className="py-2 text-left hover:text-orange-400 transition-colors flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>退出登录</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-2 hover:text-orange-400 transition-colors">登录</Link>
                  <Link to="/register" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-colors text-center">注册</Link>
                </>
              )}
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
