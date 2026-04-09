import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Settings, History, BookOpen, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [learningHistory, setLearningHistory] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setName(user.user_metadata?.name || user.email.split('@')[0]);
        setEmail(user.email);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    // 模拟学习历史数据
    setLearningHistory([
      {
        id: '1',
        type: 'course',
        title: 'Python数据分析基础',
        progress: 60,
        last_accessed: '2026-01-25 14:30',
        duration: '4小时30分钟'
      },
      {
        id: '2',
        type: 'practice',
        title: 'Python基础练习',
        completed: true,
        completed_at: '2026-01-20 10:15'
      },
      {
        id: '3',
        type: 'assessment',
        title: 'Pandas章节测评',
        score: 85,
        completed_at: '2026-01-18 16:45'
      },
      {
        id: '4',
        type: 'course',
        title: 'Pandas数据处理',
        progress: 25,
        last_accessed: '2026-01-24 09:20',
        duration: '1小时15分钟'
      }
    ]);
  }, []);

  const handleUpdateProfile = async () => {
    if (user) {
      await supabase.auth.updateUser({
        data: { name }
      });
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p>请先登录</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">个人中心</h1>

      {/* 个人信息 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5" />
            个人信息
          </h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-blue-800 hover:text-blue-600 font-medium"
            >
              <Edit className="h-4 w-4" />
              编辑
            </button>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-800 font-bold text-2xl">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      保存
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      <X className="h-4 w-4" />
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">姓名</p>
                    <p className="font-medium">{name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">邮箱</p>
                    <p className="font-medium">{email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">账号创建时间</p>
                    <p className="font-medium">{new Date(user.created_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 学习历史 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <History className="h-5 w-5" />
          学习历史
        </h2>
        <div className="space-y-4">
          {learningHistory.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.type === 'course' ? 'bg-blue-100 text-blue-800' : item.type === 'practice' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                {item.type === 'course' ? (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>学习进度</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-800 h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">最近学习: {item.last_accessed}</p>
                  </div>
                ) : item.type === 'practice' ? (
                  <p className="text-sm text-green-600 mt-1">已完成于: {item.completed_at}</p>
                ) : (
                  <p className="text-sm text-purple-600 mt-1">得分: {item.score}%，完成于: {item.completed_at}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 账号设置 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          账号设置
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div>
              <h3 className="font-medium">修改密码</h3>
              <p className="text-sm text-gray-600">更新您的账号密码</p>
            </div>
            <button className="text-blue-800 hover:text-blue-600 font-medium">
              点击修改
            </button>
          </div>
          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div>
              <h3 className="font-medium">通知设置</h3>
              <p className="text-sm text-gray-600">管理您的通知偏好</p>
            </div>
            <button className="text-blue-800 hover:text-blue-600 font-medium">
              点击设置
            </button>
          </div>
          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div>
              <h3 className="font-medium">隐私设置</h3>
              <p className="text-sm text-gray-600">管理您的隐私选项</p>
            </div>
            <button className="text-blue-800 hover:text-blue-600 font-medium">
              点击设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
