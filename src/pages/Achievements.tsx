import { useState, useEffect } from 'react';
import { Trophy, Award, Star, Users, ChevronRight } from 'lucide-react';

const Achievements = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(15);
  const [userPoints, setUserPoints] = useState<number>(250);

  useEffect(() => {
    // 模拟成就数据
    setAchievements([
      {
        id: '1',
        name: 'Python入门',
        description: '完成Python基础课程',
        unlocked: true,
        date: '2026-01-15',
        points: 50
      },
      {
        id: '2',
        name: '数据处理能手',
        description: '完成Pandas练习',
        unlocked: true,
        date: '2026-01-20',
        points: 75
      },
      {
        id: '3',
        name: '可视化大师',
        description: '完成Matplotlib课程',
        unlocked: false,
        points: 100
      },
      {
        id: '4',
        name: '机器学习入门',
        description: '完成Scikit-learn基础',
        unlocked: false,
        points: 125
      },
      {
        id: '5',
        name: '数据分析专家',
        description: '完成所有核心课程',
        unlocked: false,
        points: 200
      }
    ]);

    // 模拟徽章数据
    setBadges([
      {
        id: '1',
        name: 'Python基础',
        description: '掌握Python基本语法',
        unlocked: true,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20badge%20icon&image_size=square'
      },
      {
        id: '2',
        name: 'Pandas专家',
        description: '熟练使用Pandas库',
        unlocked: true,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Pandas%20badge%20icon&image_size=square'
      },
      {
        id: '3',
        name: '可视化达人',
        description: '精通数据可视化',
        unlocked: false,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20badge%20icon&image_size=square'
      },
      {
        id: '4',
        name: '机器学习新手',
        description: '了解机器学习基础',
        unlocked: false,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Machine%20learning%20badge%20icon&image_size=square'
      },
      {
        id: '5',
        name: '数据分析师',
        description: '具备完整数据分析能力',
        unlocked: false,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analyst%20badge%20icon&image_size=square'
      },
      {
        id: '6',
        name: '练习达人',
        description: '完成10个以上练习',
        unlocked: false,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Practice%20badge%20icon&image_size=square'
      }
    ]);

    // 模拟排行榜数据
    setLeaderboard([
      {
        rank: 1,
        name: '张三',
        points: 580,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=User%20avatar%201&image_size=square'
      },
      {
        rank: 2,
        name: '李四',
        points: 450,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=User%20avatar%202&image_size=square'
      },
      {
        rank: 3,
        name: '王五',
        points: 380,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=User%20avatar%203&image_size=square'
      },
      {
        rank: 4,
        name: '赵六',
        points: 320,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=User%20avatar%204&image_size=square'
      },
      {
        rank: 5,
        name: '孙七',
        points: 280,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=User%20avatar%205&image_size=square'
      }
    ]);
  }, []);

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">成就系统</h1>

      {/* 个人成就概览 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">个人成就概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-blue-800 mb-2">
              <Trophy className="h-8 w-8 mx-auto" />
            </div>
            <h3 className="font-semibold">总积分</h3>
            <p className="text-2xl font-bold text-blue-800">{totalPoints}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-green-800 mb-2">
              <Award className="h-8 w-8 mx-auto" />
            </div>
            <h3 className="font-semibold">已解锁成就</h3>
            <p className="text-2xl font-bold text-green-800">{unlockedAchievements}/{totalAchievements}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-yellow-800 mb-2">
              <Star className="h-8 w-8 mx-auto" />
            </div>
            <h3 className="font-semibold">已解锁徽章</h3>
            <p className="text-2xl font-bold text-yellow-800">{unlockedBadges}/{totalBadges}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-purple-800 mb-2">
              <Users className="h-8 w-8 mx-auto" />
            </div>
            <h3 className="font-semibold">排行榜排名</h3>
            <p className="text-2xl font-bold text-purple-800">#{userRank}</p>
          </div>
        </div>
      </div>

      {/* 成就列表 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">我的成就</h2>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`flex items-center justify-between p-4 rounded-md ${achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.unlocked && (
                    <p className="text-xs text-gray-500 mt-1">解锁于: {achievement.date}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{achievement.points} 积分</span>
                {achievement.unlocked ? (
                  <span className="text-green-600 font-medium">已解锁</span>
                ) : (
                  <span className="text-gray-400 font-medium">未解锁</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 徽章墙 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">技能徽章</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className={`p-4 rounded-lg text-center ${badge.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="w-16 h-16 mx-auto mb-3 overflow-hidden rounded-full">
                <img 
                  src={badge.image} 
                  alt={badge.name} 
                  className={`w-full h-full object-cover ${badge.unlocked ? 'opacity-100' : 'opacity-50'}`}
                />
              </div>
              <h3 className="font-medium text-sm">{badge.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 排行榜 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">排行榜</h2>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div key={user.rank} className={`flex items-center justify-between p-4 rounded-md ${user.rank <= 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${user.rank === 1 ? 'bg-yellow-500 text-white' : user.rank === 2 ? 'bg-gray-400 text-white' : user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {user.rank}
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <span className="font-bold">{user.points} 积分</span>
            </div>
          ))}
          {/* 当前用户 */}
          <div className="flex items-center justify-between p-4 rounded-md bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-blue-600 text-white">
                {userRank}
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <span className="font-medium">我</span>
              </div>
              <span className="font-medium">我</span>
            </div>
            <span className="font-bold">{userPoints} 积分</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button className="flex items-center gap-1 text-blue-800 hover:text-blue-600 font-medium">
            查看完整排行榜
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
