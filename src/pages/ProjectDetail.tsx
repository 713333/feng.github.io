import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { runPythonCode } from '../utils/pyodide';
import { saveProjectProgress, getProjectProgress } from '../utils/localStorage';

const projects = [
  {
    id: '1',
    title: '项目1：数据基础与环境搭建',
    description: '学习Python数据分析的基础环境搭建，包括Pyodide的使用和基本数据结构',
    instructions: '请编写一个Python脚本，创建一个包含学生信息的数据集，并计算学生的平均成绩。',
    starterCode: `# 创建学生信息数据集
import pandas as pd

# 创建数据
data = {
    '姓名': ['张三', '李四', '王五', '赵六', '钱七'],
    '年龄': [18, 19, 18, 20, 19],
    '语文': [85, 90, 78, 92, 88],
    '数学': [92, 88, 95, 86, 90],
    '英语': [88, 92, 80, 85, 90]
}

# 创建DataFrame
df = pd.DataFrame(data)

# 计算平均成绩
df['平均成绩'] = df[['语文', '数学', '英语']].mean(axis=1)

# 打印结果
print('学生信息数据集:')
print(df)
print('\n平均成绩统计:')
print(df['平均成绩'].describe())`
  },
  {
    id: '2',
    title: '项目2：数据清洗与预处理',
    description: '掌握数据清洗的基本技巧，包括缺失值处理、异常值检测和数据转换',
    instructions: '请编写一个Python脚本，处理包含缺失值和异常值的数据集。',
    starterCode: `# 数据清洗与预处理
import pandas as pd
import numpy as np

# 创建包含缺失值和异常值的数据集
data = {
    '产品': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    '价格': [100, 150, np.nan, 200, 250, 300, 1000],  # 1000是异常值
    '销量': [10, np.nan, 15, 20, 25, 30, 35],
    '利润': [10, 15, 20, np.nan, 30, 35, 40]
}

df = pd.DataFrame(data)

print('原始数据:')
print(df)

# 处理缺失值
df['价格'] = df['价格'].fillna(df['价格'].mean())
df['销量'] = df['销量'].fillna(df['销量'].mean())
df['利润'] = df['利润'].fillna(df['利润'].mean())

# 处理异常值（使用IQR方法）
Q1 = df['价格'].quantile(0.25)
Q3 = df['价格'].quantile(0.75)
iqr = Q3 - Q1
lower_bound = Q1 - 1.5 * iqr
upper_bound = Q3 + 1.5 * iqr

df['价格'] = np.where(df['价格'] > upper_bound, upper_bound, df['价格'])

print('\n处理后的数据:')
print(df)`
  },
  {
    id: '3',
    title: '项目3：数据可视化基础',
    description: '学习使用Matplotlib和Seaborn创建基本的数据可视化图表',
    instructions: '请编写一个Python脚本，创建多种类型的图表来可视化数据集。',
    starterCode: `# 数据可视化基础
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# 创建数据集
data = {
    '月份': ['1月', '2月', '3月', '4月', '5月', '6月'],
    '销售额': [10000, 12000, 15000, 18000, 20000, 25000],
    '利润': [2000, 2400, 3000, 3600, 4000, 5000],
    '客户数': [100, 120, 150, 180, 200, 250]
}

df = pd.DataFrame(data)

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
plt.rcParams['axes.unicode_minus'] = False

# 1. 折线图
plt.figure(figsize=(10, 6))
plt.plot(df['月份'], df['销售额'], marker='o', label='销售额')
plt.plot(df['月份'], df['利润'], marker='s', label='利润')
plt.title('销售额和利润趋势')
plt.xlabel('月份')
plt.ylabel('金额')
plt.legend()
plt.tight_layout()
plt.show()

# 2. 柱状图
plt.figure(figsize=(10, 6))
sns.barplot(x='月份', y='客户数', data=df)
plt.title('每月客户数')
plt.tight_layout()
plt.show()

# 3. 散点图
plt.figure(figsize=(10, 6))
sns.scatterplot(x='销售额', y='利润', data=df, size='客户数', sizes=(50, 200))
plt.title('销售额与利润关系')
plt.tight_layout()
plt.show()`
  },
  {
    id: '4',
    title: '项目4：探索性数据分析',
    description: '掌握探索性数据分析的方法，包括描述性统计和数据分布分析',
    instructions: '请编写一个Python脚本，对给定数据集进行探索性分析。',
    starterCode: `# 探索性数据分析
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 创建数据集
np.random.seed(42)
data = {
    '年龄': np.random.randint(18, 70, 100),
    '收入': np.random.normal(5000, 1500, 100),
    '消费': np.random.normal(3000, 1000, 100),
    '满意度': np.random.randint(1, 6, 100)
}

df = pd.DataFrame(data)

# 基本统计信息
print('基本统计信息:')
print(df.describe())

# 数据分布
print('\n数据分布:')
print(df.value_counts('满意度'))

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
plt.rcParams['axes.unicode_minus'] = False

# 年龄分布
plt.figure(figsize=(10, 6))
sns.histplot(df['年龄'], bins=10, kde=True)
plt.title('年龄分布')
plt.tight_layout()
plt.show()

# 收入与消费关系
plt.figure(figsize=(10, 6))
sns.scatterplot(x='收入', y='消费', data=df)
plt.title('收入与消费关系')
plt.tight_layout()
plt.show()

# 相关性分析
print('\n相关性分析:')
print(df.corr())

# 相关性热力图
plt.figure(figsize=(10, 6))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title('相关性热力图')
plt.tight_layout()
plt.show()`
  },
  {
    id: '5',
    title: '项目5：假设检验',
    description: '学习统计假设检验的基本原理和应用方法',
    instructions: '请编写一个Python脚本，对给定数据集进行假设检验。',
    starterCode: `# 假设检验
import pandas as pd
import numpy as np
from scipy import stats

# 创建数据集
np.random.seed(42)

# 两组数据：A组和B组的测试成绩
group_a = np.random.normal(80, 10, 50)
group_b = np.random.normal(85, 10, 50)

data = {
    '组别': ['A'] * 50 + ['B'] * 50,
    '成绩': np.concatenate([group_a, group_b])
}

df = pd.DataFrame(data)

print('A组成绩统计:')
print(df[df['组别'] == 'A']['成绩'].describe())

print('\nB组成绩统计:')
print(df[df['组别'] == 'B']['成绩'].describe())

# 独立样本t检验
statistic, p_value = stats.ttest_ind(group_a, group_b)

print('\n独立样本t检验结果:')
print(f'统计量: {statistic:.4f}')
print(f'p值: {p_value:.4f}')

if p_value < 0.05:
    print('拒绝原假设，两组成绩存在显著差异')
else:
    print('不拒绝原假设，两组成绩无显著差异')

# 正态性检验
print('\nA组正态性检验:')
statistic_a, p_value_a = stats.normaltest(group_a)
print(f'统计量: {statistic_a:.4f}')
print(f'p值: {p_value_a:.4f}')

print('\nB组正态性检验:')
statistic_b, p_value_b = stats.normaltest(group_b)
print(f'统计量: {statistic_b:.4f}')
print(f'p值: {p_value_b:.4f}')`
  },
  {
    id: '6',
    title: '项目6：回归分析',
    description: '掌握线性回归和逻辑回归的原理和实现方法',
    instructions: '请编写一个Python脚本，对给定数据集进行回归分析。',
    starterCode: `# 回归分析
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, accuracy_score

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
plt.rcParams['axes.unicode_minus'] = False

# 创建线性回归数据集
np.random.seed(42)
x = np.linspace(0, 10, 100)
y = 2 * x + 1 + np.random.normal(0, 2, 100)

linear_data = {'x': x, 'y': y}
linear_df = pd.DataFrame(linear_data)

# 线性回归
X = linear_df[['x']]
y = linear_df['y']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

linear_model = LinearRegression()
linear_model.fit(X_train, y_train)

y_pred = linear_model.predict(X_test)
r2 = r2_score(y_test, y_pred)

print(f'线性回归R²值: {r2:.4f}')
print(f'回归系数: {linear_model.coef_[0]:.4f}')
print(f'截距: {linear_model.intercept_:.4f}')

# 可视化线性回归结果
plt.figure(figsize=(10, 6))
plt.scatter(X, y, label='原始数据')
plt.plot(X, linear_model.predict(X), color='red', label='回归直线')
plt.title('线性回归分析')
plt.xlabel('X')
plt.ylabel('Y')
plt.legend()
plt.tight_layout()
plt.show()`
  },
  {
    id: '7',
    title: '项目7：分类算法',
    description: '学习常见的分类算法，如决策树、随机森林和支持向量机',
    instructions: '请编写一个Python脚本，使用分类算法对给定数据集进行分类。',
    starterCode: `# 分类算法
import pandas as pd
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report

# 加载数据集
iris = load_iris()
X = iris.data
y = iris.target

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 决策树
dt_model = DecisionTreeClassifier(random_state=42)
dt_model.fit(X_train, y_train)
dt_pred = dt_model.predict(X_test)
dt_accuracy = accuracy_score(y_test, dt_pred)

# 随机森林
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
rf_pred = rf_model.predict(X_test)
rf_accuracy = accuracy_score(y_test, rf_pred)

# 支持向量机
svm_model = SVC(kernel='rbf', random_state=42)
svm_model.fit(X_train, y_train)
svm_pred = svm_model.predict(X_test)
svm_accuracy = accuracy_score(y_test, svm_pred)

print('分类算法准确率:')
print(f'决策树: {dt_accuracy:.4f}')
print(f'随机森林: {rf_accuracy:.4f}')
print(f'支持向量机: {svm_accuracy:.4f}')

print('\n随机森林分类报告:')
print(classification_report(y_test, rf_pred, target_names=iris.target_names))`
  },
  {
    id: '8',
    title: '项目8：聚类分析',
    description: '掌握聚类分析的基本原理和应用方法',
    instructions: '请编写一个Python脚本，使用聚类算法对给定数据集进行聚类分析。',
    starterCode: `# 聚类分析
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
plt.rcParams['axes.unicode_minus'] = False

# 创建聚类数据集
X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=42)

# K-means聚类
kmeans = KMeans(n_clusters=4, random_state=42)
y_kmeans = kmeans.fit_predict(X)

# 层次聚类
agglo = AgglomerativeClustering(n_clusters=4)
y_agglo = agglo.fit_predict(X)

# DBSCAN聚类
dbscan = DBSCAN(eps=0.5, min_samples=5)
y_dbscan = dbscan.fit_predict(X)

# 计算轮廓系数
kmeans_score = silhouette_score(X, y_kmeans)
agglo_score = silhouette_score(X, y_agglo)

try:
    dbscan_score = silhouette_score(X, y_dbscan)
except:
    dbscan_score = -1

print('聚类算法轮廓系数:')
print(f'K-means: {kmeans_score:.4f}')
print(f'层次聚类: {agglo_score:.4f}')
print(f'DBSCAN: {dbscan_score:.4f}')

# 可视化聚类结果
fig, axes = plt.subplots(1, 3, figsize=(18, 6))

axes[0].scatter(X[:, 0], X[:, 1], c=y_kmeans, s=50, cmap='viridis')
axes[0].set_title('K-means聚类')

axes[1].scatter(X[:, 0], X[:, 1], c=y_agglo, s=50, cmap='viridis')
axes[1].set_title('层次聚类')

axes[2].scatter(X[:, 0], X[:, 1], c=y_dbscan, s=50, cmap='viridis')
axes[2].set_title('DBSCAN聚类')

plt.tight_layout()
plt.show()`
  },
  {
    id: '9',
    title: '项目9：时间序列分析',
    description: '学习时间序列分析的基本方法和预测技术',
    instructions: '请编写一个Python脚本，对给定时间序列数据进行分析和预测。',
    starterCode: `# 时间序列分析
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima.model import ARIMA

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
plt.rcParams['axes.unicode_minus'] = False

# 创建时间序列数据
date_range = pd.date_range('2020-01-01', '2023-12-31', freq='M')

# 生成带有趋势和季节性的时间序列数据
trend = np.linspace(0, 100, len(date_range))
seasonality = 50 * np.sin(np.arange(len(date_range)) * (2 * np.pi / 12))
noise = np.random.normal(0, 10, len(date_range))

value = trend + seasonality + noise

ts = pd.Series(value, index=date_range)

print('时间序列数据:')
print(ts.head())

# 可视化时间序列
plt.figure(figsize=(14, 6))
plt.plot(ts)
plt.title('时间序列数据')
plt.xlabel('日期')
plt.ylabel('值')
plt.tight_layout()
plt.show()

# 时间序列分解
decomposition = seasonal_decompose(ts, model='additive')

fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(14, 12))
decomposition.observed.plot(ax=ax1)
ax1.set_title('原始数据')
decomposition.trend.plot(ax=ax2)
ax2.set_title('趋势')
decomposition.seasonal.plot(ax=ax3)
ax3.set_title('季节性')
decomposition.resid.plot(ax=ax4)
ax4.set_title('残差')
plt.tight_layout()
plt.show()`
  },
  {
    id: '10',
    title: '项目10：综合项目实战',
    description: '运用所学知识完成一个综合的数据分析项目',
    instructions: '请编写一个Python脚本，完成一个综合的数据分析项目，包括数据获取、清洗、分析和可视化。',
    starterCode: `# 综合项目实战
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['WenQuanYi Zen Hei']
plt.rcParams['axes.unicode_minus'] = False

# 创建综合数据集
np.random.seed(42)
date_range = pd.date_range('2023-01-01', '2023-12-31', freq='D')

# 生成销售数据
products = ['A', 'B', 'C', 'D', 'E']
product_data = []

for product in products:
    # 基础销量
    base_sales = np.random.randint(100, 500)
    # 趋势
    trend = np.linspace(0, 100, len(date_range))
    # 季节性（周和月）
    weekly_seasonality = 50 * np.sin(np.arange(len(date_range)) * (2 * np.pi / 7))
    monthly_seasonality = 100 * np.sin(np.arange(len(date_range)) * (2 * np.pi / 30))
    # 噪声
    noise = np.random.normal(0, 20, len(date_range))
    # 计算销量
    sales = base_sales + trend + weekly_seasonality + monthly_seasonality + noise
    # 确保销量为正
    sales = np.maximum(sales, 0)
    # 添加到数据列表
    for i, date in enumerate(date_range):
        product_data.append({
            '日期': date,
            '产品': product,
            '销量': sales[i],
            '单价': np.random.uniform(10, 50),
            '地区': np.random.choice(['北京', '上海', '广州', '深圳', '成都'])
        })

# 创建DataFrame
df = pd.DataFrame(product_data)

# 计算销售额
df['销售额'] = df['销量'] * df['单价']

print('数据集基本信息:')
print(df.info())
print('\n数据集前5行:')
print(df.head())

# 1. 产品销售分析
product_sales = df.groupby('产品')['销售额'].sum().sort_values(ascending=False)
print('\n产品销售额排名:')
print(product_sales)

# 2. 地区销售分析
region_sales = df.groupby('地区')['销售额'].sum().sort_values(ascending=False)
print('\n地区销售额排名:')
print(region_sales)

# 3. 月度销售趋势
# 按月分组
df['月份'] = df['日期'].dt.to_period('M')
monthly_sales = df.groupby('月份')['销售额'].sum()

# 可视化
plt.figure(figsize=(14, 6))
plt.plot(monthly_sales.index.astype(str), monthly_sales.values)
plt.title('月度销售趋势')
plt.xlabel('月份')
plt.ylabel('销售额')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 4. 产品销售热力图
pivot_table = df.pivot_table(values='销售额', index='产品', columns='地区', aggfunc='sum')

plt.figure(figsize=(12, 8))
sns.heatmap(pivot_table, annot=True, fmt='.0f', cmap='YlOrRd')
plt.title('产品-地区销售热力图')
plt.tight_layout()
plt.show()`
  }
];

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [aiMessages, setAiMessages] = useState<{ role: string; content: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProject = projects.find(p => p.id === id);
      if (foundProject) {
        setProject(foundProject);
        const progress = getProjectProgress(id);
        setCode(progress.code || foundProject.starterCode);
        setCompleted(progress.completed);
      } else {
        navigate('/projects');
      }
    }
  }, [id, navigate]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const result = await runPythonCode(code);
      if (result.success) {
        setOutput(result.result?.toString() || '代码执行成功');
      } else {
        setOutput(`错误: ${result.error}`);
      }
    } catch (error) {
      setOutput(`执行失败: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveProgress = () => {
    if (id) {
      saveProjectProgress(id, { code, completed });
      alert('进度已保存');
    }
  };

  const handleToggleCompleted = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    if (id) {
      saveProjectProgress(id, { code, completed: newCompleted });
    }
  };

  const handleAiSubmit = async () => {
    if (!aiInput.trim()) return;

    const newMessage = { role: 'user', content: aiInput };
    setAiMessages(prev => [...prev, newMessage]);
    setAiInput('');
    setIsLoadingAi(true);

    try {
      // 这里应该调用Cloudflare Workers的AI代理
      // 由于是模拟环境，我们返回一个模拟响应
      setTimeout(() => {
        const aiResponse = {
          role: 'assistant',
          content: '我是你的AI数据分析教练。让我分析一下你的问题...\n\n根据你的代码，我建议你注意以下几点：\n1. 确保数据类型正确\n2. 处理可能的异常情况\n3. 优化代码结构，提高可读性\n\n如果你遇到具体问题，请提供更多细节，我会更详细地帮助你。'
        };
        setAiMessages(prev => [...prev, aiResponse]);
        setIsLoadingAi(false);
      }, 1000);
    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'AI请求失败，请稍后再试' }]);
      setIsLoadingAi(false);
    }
  };

  if (!project) {
    return <div className="container mx-auto px-4 py-12">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center text-blue-600 font-medium"
        >
          <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回项目列表
        </button>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={handleToggleCompleted}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">标记为完成</span>
          </label>
          <button
            onClick={handleSaveProgress}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            保存进度
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{project.title}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">任务说明</h2>
          <p className="text-gray-600">{project.instructions}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">代码编辑器</h2>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? '运行中...' : '运行代码'}
              </button>
            </div>
            <div className="h-[500px]">
              <Editor
                height="100%"
                defaultLanguage="python"
                value={code}
                onChange={(value) => value && setCode(value)}
                options={{
                  minimap: { enabled: true },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  tabSize: 4,
                  wordWrap: 'on'
                }}
              />
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">运行结果</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[300px]">
              <pre>{output || '点击"运行代码"查看结果'}</pre>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">AI学习助手</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">遇到问题？向AI助手寻求帮助：</p>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setAiInput('我的代码报错了，帮我看看')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                >
                  代码纠错
                </button>
                <button
                  onClick={() => setAiInput('我卡住了，下一步该怎么做')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                >
                  思路点拨
                </button>
                <button
                  onClick={() => setAiInput('这个项目的核心知识点是什么')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                >
                  知识点解析
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-md mb-4 h-[400px] overflow-y-auto p-3">
              {aiMessages.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  开始与AI助手对话吧
                </div>
              ) : (
                aiMessages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isLoadingAi && (
                <div className="text-left mb-4">
                  <div className="inline-block max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                    <p>AI正在思考...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiSubmit()}
                placeholder="输入你的问题..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAiSubmit}
                disabled={isLoadingAi}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;