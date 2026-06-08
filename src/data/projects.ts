export interface Project {
  id: string;
  title: string;
  description: string;
  instructions: string;
  level: string;
  duration: string;
  skills: string[];
  icon: string;
  color: string;
  knowledgePoints: KnowledgePoint[];
  practiceCode: string;
  starterCode: string;
  quiz: QuizQuestion[];
}

export interface KnowledgePoint {
  title: string;
  content: string;
  details: string[];
}

export interface QuizQuestion {
  type: 'multiple' | 'code';
  question: string;
  options?: string[];
  correct?: number;
  hint?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: '项目1：数据基础与环境搭建',
    description: '学习Python数据分析的基础环境搭建，包括Pyodide的使用和基本数据结构',
    instructions: '请编写一个Python脚本，创建一个包含学生信息的数据集，并计算学生的平均成绩。',
    level: '入门',
    duration: '2小时',
    skills: ['Python基础', 'Pyodide', '数据结构'],
    icon: 'Code',
    color: 'green',
    knowledgePoints: [
      {
        title: 'Pyodide简介',
        content: 'Pyodide是一个在浏览器中运行的Python发行版，它使用WebAssembly技术，可以在任何现代浏览器中执行Python代码。',
        details: [
          '无需安装任何软件，打开浏览器即可使用',
          '支持大部分Python标准库',
          '可以加载常用的数据分析库如pandas、numpy',
          '首次加载需要下载Python运行时，后续可缓存使用'
        ]
      },
      {
        title: 'Pandas DataFrame基础',
        content: 'DataFrame是Pandas中最常用的数据结构，类似于Excel表格，是一个二维标记的数据结构。',
        details: [
          '创建：pd.DataFrame(data) 其中data是字典或列表',
          '查看数据：df.head() 查看前5行，df.tail() 查看后5行',
          '基本信息：df.info() 查看数据类型和缺失值，df.describe() 查看统计信息',
          '索引访问：df["列名"] 或 df[["列1", "列2"]]',
          '计算：df["列"].mean() 计算平均值，df["列"].sum() 计算总和'
        ]
      },
      {
        title: '数据基本操作',
        content: '掌握DataFrame的基本操作是进行数据分析的基础。',
        details: [
          '添加新列：df["新列"] = 值或表达式',
          '删除列：df.drop("列名", axis=1)',
          '重命名列：df.rename(columns={"旧名": "新名"})',
          '数据筛选：df[df["列"] > 值]',
          '排序：df.sort_values(by="列名")'
        ]
      }
    ],
    practiceCode: `# 跟着练习：创建学生数据集
import pandas as pd

# 创建学生数据
data = {
    '姓名': ['张三', '李四', '王五'],
    '年龄': [18, 19, 18],
    '数学': [85, 90, 78]
}

# 创建DataFrame
df = pd.DataFrame(data)

# 添加新列
df['语文'] = [90, 85, 92]

# 计算平均分
df['平均分'] = df[['数学', '语文']].mean(axis=1)

print(df)`,
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
print('\\n平均成绩统计:')
print(df['平均成绩'].describe())`,
    quiz: [
      {
        type: 'multiple',
        question: 'DataFrame是哪个库中的数据结构？',
        options: ['numpy', 'pandas', 'matplotlib', 'seaborn'],
        correct: 1
      },
      {
        type: 'multiple',
        question: '查看DataFrame前几行数据用什么方法？',
        options: ['tail()', 'head()', 'info()', 'describe()'],
        correct: 1
      },
      {
        type: 'code',
        question: '请创建一个包含姓名和年龄的DataFrame，至少包含3个人的数据',
        hint: '使用pandas的DataFrame函数，传入字典作为参数'
      }
    ]
  },
  {
    id: '2',
    title: '项目2：数据清洗与预处理',
    description: '掌握数据清洗的基本技巧，包括缺失值处理、异常值检测和数据转换',
    instructions: '请编写一个Python脚本，处理包含缺失值和异常值的数据集。',
    level: '入门',
    duration: '3小时',
    skills: ['缺失值处理', '异常值检测', '数据转换'],
    icon: 'BarChart',
    color: 'green',
    knowledgePoints: [
      {
        title: '缺失值处理',
        content: '缺失值是数据分析中最常见的问题之一，需要根据业务场景选择合适的处理方法。',
        details: [
          '识别缺失值：df.isnull().sum() 统计每列缺失值数量',
          '删除缺失值：df.dropna() 删除包含缺失值的行',
          '填充缺失值：df.fillna(值) 使用指定值填充',
          '均值填充：df["列"].fillna(df["列"].mean())',
          '前向/后向填充：df.fillna(method="ffill") 或 df.fillna(method="bfill")'
        ]
      },
      {
        title: '异常值检测',
        content: '异常值（outliers）是与大多数数据点显著不同的数据，需要识别和处理。',
        details: [
          'IQR方法：Q1 - 1.5*IQR 和 Q3 + 1.5*IQR 之外的值为异常值',
          'Z-score方法：|z| > 3 的值为异常值',
          '可视化方法：使用箱线图(boxplot)直观识别异常值',
          '业务判断：根据业务知识定义合理的数据范围',
          '处理方式：删除、替换为边界值、或保留但标记'
        ]
      },
      {
        title: '数据转换',
        content: '数据转换包括数据类型转换、数据标准化、数据离散化等操作。',
        details: [
          '类型转换：df["列"].astype("类型")',
          '字符串处理：df["列"].str.lower()、df["列"].str.strip()',
          '日期处理：pd.to_datetime(df["日期列"])',
          '数据标准化：(x - mean) / std 或 (x - min) / (max - min)',
          '数据离散化：pd.cut() 或 pd.qcut() 将连续数据分组'
        ]
      }
    ],
    practiceCode: `# 跟着练习：处理缺失值
import pandas as pd
import numpy as np

# 创建包含缺失值的数据
data = {
    '产品': ['A', 'B', 'C', 'D'],
    '价格': [100, np.nan, 150, 200],
    '销量': [50, 60, np.nan, 80]
}

df = pd.DataFrame(data)

print('原始数据:')
print(df)

# 填充缺失值
df['价格'] = df['价格'].fillna(df['价格'].mean())
df['销量'] = df['销量'].fillna(df['销量'].median())

print('\\n填充后的数据:')
print(df)`,
    starterCode: `# 数据清洗与预处理
import pandas as pd
import numpy as np

# 创建包含缺失值和异常值的数据集
data = {
    '产品': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    '价格': [100, 150, np.nan, 200, 250, 300, 1000],
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

print('\\n处理后的数据:')
print(df)`,
    quiz: [
      {
        type: 'multiple',
        question: '用来填充缺失值的方法是？',
        options: ['dropna()', 'fillna()', 'isnull()', 'sum()'],
        correct: 1
      },
      {
        type: 'multiple',
        question: 'IQR方法中，异常值边界是？',
        options: ['Q1和Q3', 'Q1 - 1.5*IQR 和 Q3 + 1.5*IQR', 'mean ± 3*std', 'min和max'],
        correct: 1
      },
      {
        type: 'code',
        question: '创建一个包含缺失值的DataFrame，并用列的平均值填充',
        hint: '先用np.nan创建缺失值，然后用fillna和mean方法'
      }
    ]
  },
  {
    id: '3',
    title: '项目3：数据可视化基础',
    description: '学习使用Matplotlib和Seaborn创建基本的数据可视化图表',
    instructions: '请编写一个Python脚本，创建多种类型的图表来可视化数据集。',
    level: '入门',
    duration: '3小时',
    skills: ['Matplotlib', 'Seaborn', '图表绘制'],
    icon: 'Users',
    color: 'green',
    knowledgePoints: [
      {
        title: 'Matplotlib基础',
        content: 'Matplotlib是Python最流行的可视化库，提供了丰富的绘图功能。',
        details: [
          '导入：import matplotlib.pyplot as plt',
          '创建图表：plt.figure() 创建画布，plt.plot() 绑制折线图',
          '显示图表：plt.show() 或 plt.savefig() 保存图表',
          '设置中文：plt.rcParams["font.sans-serif"] = ["WenQuanYi Zen Hei"]',
          '常用图表：plot(折线)、bar(柱状)、scatter(散点)、hist(直方图)'
        ]
      },
      {
        title: 'Seaborn高级可视化',
        content: 'Seaborn基于Matplotlib，提供了更美观的默认样式和更简单的API。',
        details: [
          '导入：import seaborn as sns',
          '关系图：sns.relplot() 绘制变量间关系',
          '分类图：sns.catplot() 绘制分类数据',
          '分布图：sns.distplot() 绘制分布直方图',
          '热力图：sns.heatmap() 显示相关性矩阵',
          '设置样式：sns.set_style("whitegrid")'
        ]
      },
      {
        title: '图表优化技巧',
        content: '掌握图表优化的技巧可以让你的可视化更加专业和美观。',
        details: [
          '标题和标签：plt.title()、plt.xlabel()、plt.ylabel()',
          '图例：plt.legend() 添加图例说明',
          '网格线：plt.grid(True) 添加网格线',
          '多子图：fig, axes = plt.subplots(2, 2) 创建多子图',
          '调整布局：plt.tight_layout() 自动调整子图间距',
          '保存图表：plt.savefig("filename.png", dpi=300) 高清保存'
        ]
      }
    ],
    practiceCode: `# 跟着练习：画一个简单的折线图
import matplotlib.pyplot as plt

# 数据
月份 = ['1月', '2月', '3月']
销售额 = [1000, 1200, 1500]

# 设置中文显示
plt.rcParams['font.sans-serif'] = ['DejaVu Sans']

# 创建折线图
plt.figure(figsize=(8, 5))
plt.plot(月份, 销售额, marker='o', label='销售额')

# 添加标题和标签
plt.title('销售趋势')
plt.xlabel('月份')
plt.ylabel('金额')
plt.legend()

plt.show()`,
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
plt.rcParams['font.sans-serif'] = ['DejaVu Sans']
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
plt.show()`,
    quiz: [
      {
        type: 'multiple',
        question: '创建折线图的函数是？',
        options: ['plt.bar()', 'plt.scatter()', 'plt.plot()', 'plt.hist()'],
        correct: 2
      },
      {
        type: 'multiple',
        question: '显示图表的函数是？',
        options: ['plt.savefig()', 'plt.show()', 'plt.figure()', 'plt.legend()'],
        correct: 1
      },
      {
        type: 'code',
        question: '创建一个包含两个列表的简单柱状图',
        hint: '使用plt.bar函数，传入x轴和y轴数据'
      }
    ]
  },
  {
    id: '4',
    title: '项目4：探索性数据分析（EDA）',
    description: '掌握探索性数据分析的方法，包括描述性统计和数据分布分析',
    instructions: '请编写一个Python脚本，对给定数据集进行探索性数据分析。',
    level: '进阶',
    duration: '4小时',
    skills: ['描述性统计', '分布分析', '相关性分析'],
    icon: 'BarChart',
    color: 'blue',
    knowledgePoints: [
      {
        title: '描述性统计分析',
        content: '描述性统计是数据分析的第一步，用于了解数据的基本特征。',
        details: [
          '集中趋势：mean(均值)、median(中位数)、mode(众数)',
          '离散程度：std(标准差)、var(方差)、range(极差)',
          '分布形状：skew(偏度)、kurt(峰度)',
          '分位数：quantile() 获取特定分位数值',
          'df.describe() 快速获取基本统计信息'
        ]
      },
      {
        title: '数据分布分析',
        content: '了解数据的分布特征对于后续分析至关重要。',
        details: [
          '直方图：plt.hist() 展示数据分布形态',
          '核密度估计：sns.kdeplot() 平滑的分布曲线',
          '箱线图：sns.boxplot() 展示五数概括',
          'QQ图：用于检验数据是否服从正态分布',
          '正态性检验：Shapiro-Wilk检验、Kolmogorov-Smirnov检验'
        ]
      },
      {
        title: '相关性分析',
        content: '分析变量之间的关系强度和方向。',
        details: [
          '相关系数：df.corr() 计算皮尔逊相关系数',
          '相关矩阵热力图：sns.heatmap() 可视化相关性',
          '散点图矩阵：pd.plotting.scatter_matrix()',
          '协方差：df.cov() 衡量变量间的协变程度',
          '注意：相关性不等于因果关系'
        ]
      }
    ],
    practiceCode: `# 跟着练习：描述性统计
import pandas as pd
import numpy as np

# 创建示例数据
data = {
    '年龄': [20, 21, 19, 22, 20, 21, 19, 23, 20, 22],
    '成绩': [85, 90, 78, 92, 88, 85, 95, 80, 87, 91],
    '出勤天数': [28, 30, 25, 30, 29, 27, 30, 26, 28, 29]
}

df = pd.DataFrame(data)

# 描述性统计
print('基本统计信息:')
print(df.describe())

print('\\n相关矩阵:')
print(df.corr())`,
    starterCode: `# 探索性数据分析（EDA）
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 创建销售数据集
data = {
    '产品类别': ['电子产品', '服装', '食品', '电子产品', '服装', '食品', '电子产品', '服装', '食品', '电子产品'],
    '销售额': [2500, 1800, 1200, 3000, 2200, 1500, 2800, 1900, 1300, 3200],
    '利润': [500, 360, 240, 600, 440, 300, 560, 380, 260, 640],
    '客户满意度': [85, 78, 92, 88, 82, 95, 86, 80, 93, 89],
    '促销活动': [1, 0, 1, 1, 1, 0, 0, 0, 1, 1]
}

df = pd.DataFrame(data)

plt.rcParams['font.sans-serif'] = ['DejaVu Sans']

# 1. 描述性统计
print('=== 描述性统计 ===')
print(df.describe())

# 2. 相关性分析
print('\\n=== 相关矩阵 ===')
print(df.corr())

# 3. 可视化分布
plt.figure(figsize=(12, 8))

# 销售额直方图
plt.subplot(2, 2, 1)
sns.histplot(df['销售额'], kde=True)
plt.title('销售额分布')

# 利润与销售额散点图
plt.subplot(2, 2, 2)
sns.scatterplot(x='销售额', y='利润', data=df)
plt.title('销售额与利润关系')

# 客户满意度箱线图
plt.subplot(2, 2, 3)
sns.boxplot(x='产品类别', y='客户满意度', data=df)
plt.title('不同类别客户满意度')

# 相关矩阵热力图
plt.subplot(2, 2, 4)
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title('相关矩阵')

plt.tight_layout()
plt.show()`,
    quiz: [
      {
        type: 'multiple',
        question: '哪个方法可以快速获取数据的基本统计信息？',
        options: ['df.info()', 'df.describe()', 'df.head()', 'df.values'],
        correct: 1
      },
      {
        type: 'multiple',
        question: '用于衡量变量之间线性关系强度的指标是？',
        options: ['均值', '标准差', '相关系数', '中位数'],
        correct: 2
      },
      {
        type: 'code',
        question: '计算DataFrame中数值列的相关矩阵并打印',
        hint: '使用corr()方法'
      }
    ]
  },
  {
    id: '5',
    title: '项目5：假设检验',
    description: '学习统计假设检验的基本原理和应用方法',
    instructions: '请编写一个Python脚本，进行假设检验分析。',
    level: '进阶',
    duration: '4小时',
    skills: ['t检验', 'p值', '统计推断'],
    icon: 'TrendingUp',
    color: 'blue',
    knowledgePoints: [
      {
        title: '假设检验基础',
        content: '假设检验是统计推断的核心方法，用于判断样本数据是否支持某个假设。',
        details: [
          '原假设(H0)：默认成立的假设，通常表示"没有效果"或"没有差异"',
          '备择假设(H1)：我们想要证明的假设',
          '显著性水平(α)：通常取0.05，拒绝H0的阈值',
          'p值：在H0成立的前提下，观察到当前数据或更极端数据的概率',
          '决策规则：p < α 则拒绝H0，否则不拒绝H0'
        ]
      },
      {
        title: 't检验',
        content: 't检验是最常用的假设检验方法，用于比较均值差异。',
        details: [
          '单样本t检验：检验样本均值与总体均值是否有差异',
          '独立样本t检验：检验两个独立样本的均值是否有差异',
          '配对样本t检验：检验配对样本的均值差异',
          '前提条件：数据近似正态分布、方差齐性',
          '使用scipy.stats.ttest_* 系列函数'
        ]
      },
      {
        title: '卡方检验',
        content: '卡方检验用于分析分类变量之间的关联性。',
        details: [
          '卡方拟合优度检验：检验观测频数与期望频数是否一致',
          '卡方独立性检验：检验两个分类变量是否独立',
          '使用scipy.stats.chisquare() 和 scipy.stats.chi2_contingency()',
          '注意：期望频数不能太小(通常要求>5)',
          '列联表分析：pd.crosstab() 创建列联表'
        ]
      }
    ],
    practiceCode: `# 跟着练习：独立样本t检验
import numpy as np
from scipy import stats

# 创建两组数据
group1 = [85, 88, 90, 92, 87, 89, 91, 86, 88, 90]
group2 = [80, 82, 85, 83, 81, 84, 86, 82, 83, 85]

# 独立样本t检验
t_stat, p_value = stats.ttest_ind(group1, group2)

print(f't统计量: {t_stat:.4f}')
print(f'p值: {p_value:.4f}')

# 判断结果
alpha = 0.05
if p_value < alpha:
    print('拒绝原假设：两组数据均值存在显著差异')
else:
    print('不拒绝原假设：两组数据均值无显著差异')`,
    starterCode: `# 假设检验
import numpy as np
import pandas as pd
from scipy import stats

# 创建数据
data = {
    '实验组': [85, 88, 90, 92, 87, 89, 91, 86, 88, 90, 93, 87],
    '对照组': [80, 82, 85, 83, 81, 84, 86, 82, 83, 85, 84, 81]
}

df = pd.DataFrame(data)

# 1. 独立样本t检验
print('=== 独立样本t检验 ===')
t_stat, p_value = stats.ttest_ind(df['实验组'], df['对照组'])
print(f't统计量: {t_stat:.4f}')
print(f'p值: {p_value:.4f}')
alpha = 0.05
if p_value < alpha:
    print('结论：拒绝原假设，两组均值存在显著差异')
else:
    print('结论：不拒绝原假设，两组均值无显著差异')

# 2. 配对样本t检验
print('\\n=== 配对样本t检验 ===')
before = [75, 78, 80, 72, 76, 79, 81, 77]
after = [80, 82, 85, 78, 80, 83, 84, 82]
t_stat_paired, p_value_paired = stats.ttest_rel(before, after)
print(f't统计量: {t_stat_paired:.4f}')
print(f'p值: {p_value_paired:.4f}')
if p_value_paired < alpha:
    print('结论：拒绝原假设，前后存在显著差异')
else:
    print('结论：不拒绝原假设，前后无显著差异')

# 3. 卡方独立性检验
print('\\n=== 卡方独立性检验 ===')
contingency_table = np.array([
    [20, 15],  # 男性：购买、未购买
    [25, 40]   # 女性：购买、未购买
])
chi2_stat, p_value_chi2, dof, expected = stats.chi2_contingency(contingency_table)
print(f'卡方统计量: {chi2_stat:.4f}')
print(f'p值: {p_value_chi2:.4f}')
if p_value_chi2 < alpha:
    print('结论：拒绝原假设，性别与购买行为存在关联')
else:
    print('结论：不拒绝原假设，性别与购买行为独立')`,
    quiz: [
      {
        type: 'multiple',
        question: '当p值小于显著性水平α时，我们应该？',
        options: ['拒绝原假设', '接受原假设', '拒绝备择假设', '无法判断'],
        correct: 0
      },
      {
        type: 'multiple',
        question: '比较两个独立样本均值差异应该使用？',
        options: ['卡方检验', '单样本t检验', '独立样本t检验', '配对t检验'],
        correct: 2
      },
      {
        type: 'code',
        question: '使用scipy进行独立样本t检验',
        hint: '使用scipy.stats.ttest_ind函数'
      }
    ]
  },
  {
    id: '6',
    title: '项目6：回归分析',
    description: '掌握线性回归和逻辑回归的原理和实现方法',
    instructions: '请编写一个Python脚本，实现线性回归和逻辑回归分析。',
    level: '进阶',
    duration: '5小时',
    skills: ['线性回归', '逻辑回归', '模型评估'],
    icon: 'TrendingUp',
    color: 'blue',
    knowledgePoints: [
      {
        title: '线性回归',
        content: '线性回归用于建立自变量和因变量之间的线性关系模型。',
        details: [
          '简单线性回归：一个自变量预测一个因变量',
          '多元线性回归：多个自变量预测一个因变量',
          '最小二乘法：最小化预测值与实际值的平方差',
          '回归系数：表示自变量对因变量的影响程度',
          '使用statsmodels或scikit-learn实现'
        ]
      },
      {
        title: '逻辑回归',
        content: '逻辑回归用于分类问题，预测事件发生的概率。',
        details: [
          '输出：0到1之间的概率值',
          'Sigmoid函数：将线性组合转换为概率',
          '二分类：预测两种结果',
          '多分类：预测多种结果(Softmax回归)',
          '损失函数：对数损失(log loss)'
        ]
      },
      {
        title: '模型评估指标',
        content: '评估回归模型的性能。',
        details: [
          'R²：决定系数，衡量模型解释方差的比例',
          'MAE：平均绝对误差',
          'MSE：均方误差',
          'RMSE：均方根误差',
          '混淆矩阵：用于分类模型评估',
          '准确率、精确率、召回率、F1分数'
        ]
      }
    ],
    practiceCode: `# 跟着练习：简单线性回归
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

# 创建数据
data = {
    '广告投入': [10, 20, 30, 40, 50, 60, 70, 80],
    '销售额': [200, 350, 450, 550, 650, 750, 850, 950]
}

df = pd.DataFrame(data)

# 创建模型
model = LinearRegression()
model.fit(df[['广告投入']], df['销售额'])

# 预测
print(f'截距: {model.intercept_:.2f}')
print(f'系数: {model.coef_[0]:.2f}')
print(f'回归方程: 销售额 = {model.intercept_:.2f} + {model.coef_[0]:.2f} * 广告投入')

# 可视化
plt.scatter(df['广告投入'], df['销售额'])
plt.plot(df['广告投入'], model.predict(df[['广告投入']]), color='red')
plt.xlabel('广告投入')
plt.ylabel('销售额')
plt.title('广告投入与销售额关系')
plt.show()`,
    starterCode: `# 回归分析
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, confusion_matrix

# === 线性回归 ===
print('=== 线性回归 ===')
data_reg = pd.DataFrame({
    '面积': [50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
    '房价': [80, 95, 110, 125, 140, 155, 170, 185, 200, 215]
})

X_reg = data_reg[['面积']]
y_reg = data_reg['房价']

model_reg = LinearRegression()
model_reg.fit(X_reg, y_reg)

print(f'截距: {model_reg.intercept_:.2f}')
print(f'系数: {model_reg.coef_[0]:.2f}')
y_pred_reg = model_reg.predict(X_reg)
print(f'R²: {r2_score(y_reg, y_pred_reg):.4f}')
print(f'RMSE: {np.sqrt(mean_squared_error(y_reg, y_pred_reg)):.2f}')

# === 逻辑回归 ===
print('\\n=== 逻辑回归 ===')
data_class = pd.DataFrame({
    '考试成绩': [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    '是否通过': [0, 0, 0, 0, 1, 1, 1, 1, 1, 1]
})

X_class = data_class[['考试成绩']]
y_class = data_class['是否通过']

model_class = LogisticRegression()
model_class.fit(X_class, y_class)

print(f'截距: {model_class.intercept_[0]:.4f}')
print(f'系数: {model_class.coef_[0][0]:.4f}')

y_pred_class = model_class.predict(X_class)
print(f'准确率: {accuracy_score(y_class, y_pred_class):.4f}')
print('混淆矩阵:')
print(confusion_matrix(y_class, y_pred_class))`,
    quiz: [
      {
        type: 'multiple',
        question: '线性回归的目标是？',
        options: ['最小化预测误差', '最大化准确率', '最小化熵', '最大化信息增益'],
        correct: 0
      },
      {
        type: 'multiple',
        question: '逻辑回归输出的是什么？',
        options: ['连续值', '分类标签', '概率值', '回归系数'],
        correct: 2
      },
      {
        type: 'code',
        question: '使用scikit-learn实现简单线性回归',
        hint: '使用LinearRegression类'
      }
    ]
  },
  {
    id: '7',
    title: '项目7：分类算法',
    description: '学习常见的分类算法，如决策树、随机森林和支持向量机',
    instructions: '请编写一个Python脚本，使用多种分类算法进行分类任务。',
    level: '高级',
    duration: '5小时',
    skills: ['决策树', '随机森林', 'SVM'],
    icon: 'Users',
    color: 'purple',
    knowledgePoints: [
      {
        title: '决策树',
        content: '决策树是一种直观的分类算法，通过一系列决策规则进行分类。',
        details: [
          '节点：表示特征测试',
          '分支：表示测试结果',
          '叶节点：表示类别',
          '分裂准则：信息增益、信息增益比、Gini系数',
          '剪枝：防止过拟合，包括预剪枝和后剪枝'
        ]
      },
      {
        title: '随机森林',
        content: '随机森林是集成学习方法，通过构建多个决策树并综合它们的预测。',
        details: [
          '随机采样：随机选择样本和特征',
          'Bagging思想：并行训练多个模型',
          '投票机制：多数投票决定最终分类',
          '特征重要性：衡量每个特征的贡献',
          '超参数：n_estimators、max_depth、min_samples_split'
        ]
      },
      {
        title: '支持向量机(SVM)',
        content: 'SVM是一种强大的分类算法，寻找最优分类边界。',
        details: [
          '最大间隔：寻找距离两类样本最远的超平面',
          '支持向量：距离超平面最近的样本点',
          '核函数：将非线性问题转换为线性问题',
          '常用核：线性核、多项式核、RBF核',
          '正则化：通过C参数控制模型复杂度'
        ]
      }
    ],
    practiceCode: `# 跟着练习：决策树分类
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 加载数据集
data = load_iris()
X = data.data
y = data.target

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 创建决策树模型
model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f'准确率: {accuracy:.4f}')

# 特征重要性
print('特征重要性:')
for name, importance in zip(data.feature_names, model.feature_importances_):
    print(f'{name}: {importance:.4f}')`,
    starterCode: `# 分类算法对比
import pandas as pd
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report

# 加载数据集
wine = load_wine()
X = pd.DataFrame(wine.data, columns=wine.feature_names)
y = wine.target

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# === 决策树 ===
print('=== 决策树 ===')
dt = DecisionTreeClassifier(max_depth=3, random_state=42)
dt.fit(X_train, y_train)
y_pred_dt = dt.predict(X_test)
print(f'准确率: {accuracy_score(y_test, y_pred_dt):.4f}')

# === 随机森林 ===
print('\\n=== 随机森林 ===')
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
y_pred_rf = rf.predict(X_test)
print(f'准确率: {accuracy_score(y_test, y_pred_rf):.4f}')

# === 支持向量机 ===
print('\\n=== 支持向量机 ===')
svm = SVC(kernel='rbf', C=1.0, random_state=42)
svm.fit(X_train, y_train)
y_pred_svm = svm.predict(X_test)
print(f'准确率: {accuracy_score(y_test, y_pred_svm):.4f}')

# 详细报告
print('\\n=== 随机森林分类报告 ===')
print(classification_report(y_test, y_pred_rf, target_names=wine.target_names))`,
    quiz: [
      {
        type: 'multiple',
        question: '随机森林使用的集成学习策略是？',
        options: ['Boosting', 'Bagging', 'Stacking', 'Blending'],
        correct: 1
      },
      {
        type: 'multiple',
        question: 'SVM中用于处理非线性问题的技术是？',
        options: ['正则化', '核函数', '特征选择', '交叉验证'],
        correct: 1
      },
      {
        type: 'code',
        question: '使用随机森林进行分类并计算准确率',
        hint: '使用RandomForestClassifier'
      }
    ]
  },
  {
    id: '8',
    title: '项目8：聚类分析',
    description: '掌握聚类分析的基本原理和应用方法',
    instructions: '请编写一个Python脚本，使用聚类算法对数据进行分组。',
    level: '高级',
    duration: '4小时',
    skills: ['K-means', '层次聚类', 'DBSCAN'],
    icon: 'Code',
    color: 'purple',
    knowledgePoints: [
      {
        title: 'K-means聚类',
        content: 'K-means是最常用的聚类算法，将数据分为K个簇。',
        details: [
          '初始化：随机选择K个质心',
          '分配：将每个样本分配到最近的质心',
          '更新：重新计算每个簇的质心',
          '迭代：重复分配和更新直到收敛',
          'K值选择：肘部法则、轮廓系数'
        ]
      },
      {
        title: '层次聚类',
        content: '层次聚类构建层次化的簇结构。',
        details: [
          '凝聚式：从单个样本开始，逐步合并',
          '分裂式：从所有样本开始，逐步分裂',
          '距离度量：欧氏距离、曼哈顿距离、余弦相似度',
          '链接方式：单链接、完全链接、平均链接',
          '树状图：可视化聚类层次结构'
        ]
      },
      {
        title: 'DBSCAN',
        content: 'DBSCAN是基于密度的聚类算法，能够发现任意形状的簇。',
        details: [
          '核心点：在ε邻域内有足够多的样本',
          '边界点：在核心点的ε邻域内但不是核心点',
          '噪声点：既不是核心点也不是边界点',
          '参数：ε(邻域半径)、min_samples(最小样本数)',
          '优点：无需指定簇数，能发现任意形状簇'
        ]
      }
    ],
    practiceCode: `# 跟着练习：K-means聚类
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# 创建数据
data = pd.DataFrame({
    'x': [1, 2, 2, 3, 4, 5, 6, 7, 8, 9],
    'y': [2, 1, 3, 2, 5, 6, 5, 7, 8, 9]
})

# 使用肘部法则选择K值
inertias = []
for k in range(1, 6):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(data)
    inertias.append(kmeans.inertia_)

plt.plot(range(1, 6), inertias, marker='o')
plt.xlabel('K值')
plt.ylabel('惯性')
plt.title('肘部法则')
plt.show()

# 使用K=2进行聚类
kmeans = KMeans(n_clusters=2, random_state=42)
data['cluster'] = kmeans.fit_predict(data[['x', 'y']])

# 可视化
plt.scatter(data['x'], data['y'], c=data['cluster'], cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], 
            marker='X', s=200, c='red')
plt.title('K-means聚类结果')
plt.show()`,
    starterCode: `# 聚类分析
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans, DBSCAN
from sklearn.datasets import make_blobs
import matplotlib.pyplot as plt

# 创建模拟数据
X, _ = make_blobs(n_samples=150, centers=4, cluster_std=0.60, random_state=0)
df = pd.DataFrame(X, columns=['x', 'y'])

plt.figure(figsize=(12, 5))

# === K-means聚类 ===
plt.subplot(1, 2, 1)
kmeans = KMeans(n_clusters=4, random_state=42)
df['kmeans_cluster'] = kmeans.fit_predict(X)
plt.scatter(df['x'], df['y'], c=df['kmeans_cluster'], cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], 
            marker='X', s=200, c='red')
plt.title('K-means聚类')

# === DBSCAN聚类 ===
plt.subplot(1, 2, 2)
dbscan = DBSCAN(eps=0.5, min_samples=5)
df['dbscan_cluster'] = dbscan.fit_predict(X)
plt.scatter(df['x'], df['y'], c=df['dbscan_cluster'], cmap='viridis')
plt.title('DBSCAN聚类')

plt.tight_layout()
plt.show()

# 输出聚类结果统计
print('=== K-means聚类统计 ===')
print(df['kmeans_cluster'].value_counts())

print('\\n=== DBSCAN聚类统计 ===')
print(df['dbscan_cluster'].value_counts())
print('注：-1表示噪声点')`,
    quiz: [
      {
        type: 'multiple',
        question: 'K-means算法需要预先指定什么参数？',
        options: ['簇的数量K', '距离阈值', '最小样本数', '迭代次数'],
        correct: 0
      },
      {
        type: 'multiple',
        question: '哪个算法不需要预先指定簇的数量？',
        options: ['K-means', '层次聚类', 'DBSCAN', '高斯混合模型'],
        correct: 2
      },
      {
        type: 'code',
        question: '使用K-means对数据进行聚类',
        hint: '使用sklearn.cluster.KMeans'
      }
    ]
  },
  {
    id: '9',
    title: '项目9：时间序列分析',
    description: '学习时间序列分析的基本方法和预测技术',
    instructions: '请编写一个Python脚本，进行时间序列分析和预测。',
    level: '高级',
    duration: '5小时',
    skills: ['趋势分析', '季节性', '预测模型'],
    icon: 'TrendingUp',
    color: 'purple',
    knowledgePoints: [
      {
        title: '时间序列基础',
        content: '时间序列是按时间顺序排列的数据序列。',
        details: [
          '组成成分：趋势、季节性、周期性、残差',
          '平稳性：统计特性不随时间变化',
          'ADF检验：检验序列平稳性',
          '差分：将非平稳序列转换为平稳序列',
          '自相关性：序列与自身滞后值的相关性'
        ]
      },
      {
        title: 'ARIMA模型',
        content: 'ARIMA是最常用的时间序列预测模型。',
        details: [
          'AR(p)：自回归模型，使用过去p个值预测当前值',
          'I(d)：差分次数，使序列平稳',
          'MA(q)：移动平均模型，使用误差的q个滞后值',
          '参数选择：ACF和PACF图',
          'SARIMA：考虑季节性的ARIMA扩展'
        ]
      },
      {
        title: '指数平滑法',
        content: '指数平滑法是简单有效的预测方法。',
        details: [
          '简单指数平滑：适用于无趋势无季节性数据',
          'Holt线性趋势：适用于有趋势数据',
          'Holt-Winters：适用于有趋势和季节性数据',
          '平滑系数：控制历史数据的权重',
          '预测区间：衡量预测的不确定性'
        ]
      }
    ],
    practiceCode: `# 跟着练习：时间序列可视化
import pandas as pd
import matplotlib.pyplot as plt

# 创建时间序列数据
dates = pd.date_range(start='2023-01-01', periods=12, freq='M')
data = pd.DataFrame({
    '日期': dates,
    '销售额': [1000, 1200, 1100, 1300, 1400, 1600, 1500, 1700, 1800, 2000, 1900, 2200]
})

# 设置日期索引
data.set_index('日期', inplace=True)

# 可视化
plt.figure(figsize=(10, 6))
plt.plot(data['销售额'])
plt.title('月度销售额趋势')
plt.xlabel('日期')
plt.ylabel('销售额')
plt.grid(True)
plt.show()

# 计算移动平均
data['MA3'] = data['销售额'].rolling(window=3).mean()
print('移动平均:')
print(data[['销售额', 'MA3']])`,
    starterCode: `# 时间序列分析
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建时间序列数据
dates = pd.date_range(start='2023-01-01', periods=36, freq='M')
np.random.seed(42)
trend = np.linspace(1000, 2000, 36)
seasonal = 200 * np.sin(np.linspace(0, 6 * np.pi, 36))
noise = np.random.normal(0, 50, 36)

data = pd.DataFrame({
    '日期': dates,
    '销售额': trend + seasonal + noise
})
data.set_index('日期', inplace=True)

plt.figure(figsize=(12, 8))

# 1. 原始数据
plt.subplot(2, 2, 1)
plt.plot(data['销售额'])
plt.title('原始时间序列')

# 2. 移动平均平滑
plt.subplot(2, 2, 2)
data['MA3'] = data['销售额'].rolling(window=3).mean()
data['MA6'] = data['销售额'].rolling(window=6).mean()
plt.plot(data['销售额'], label='原始数据')
plt.plot(data['MA3'], label='3期移动平均')
plt.plot(data['MA6'], label='6期移动平均')
plt.legend()
plt.title('移动平均平滑')

# 3. 差分
plt.subplot(2, 2, 3)
data['差分1'] = data['销售额'].diff()
plt.plot(data['差分1'])
plt.title('一阶差分')

# 4. 季节性分解（简化版）
plt.subplot(2, 2, 4)
monthly_avg = data.groupby(data.index.month)['销售额'].mean()
plt.bar(monthly_avg.index, monthly_avg.values)
plt.title('月度季节性模式')

plt.tight_layout()
plt.show()

# 计算统计量
print('=== 时间序列统计 ===')
print(f'均值: {data["销售额"].mean():.2f}')
print(f'标准差: {data["销售额"].std():.2f}')
print(f'最大值: {data["销售额"].max():.2f}')
print(f'最小值: {data["销售额"].min():.2f}')`,
    quiz: [
      {
        type: 'multiple',
        question: '时间序列的基本组成成分不包括？',
        options: ['趋势', '季节性', '周期性', '相关性'],
        correct: 3
      },
      {
        type: 'multiple',
        question: 'ARIMA模型中的I代表什么？',
        options: ['自回归', '差分', '移动平均', '集成'],
        correct: 1
      },
      {
        type: 'code',
        question: '创建时间序列数据并计算移动平均',
        hint: '使用pd.date_range创建日期，rolling计算移动平均'
      }
    ]
  },
  {
    id: '10',
    title: '项目10：购物车分析与综合实战',
    description: '运用所学知识完成一个完整的购物车数据分析项目',
    instructions: '请完成一个购物车分析项目，包括用户购买行为分析、商品关联规则挖掘等。',
    level: '专家',
    duration: '8小时',
    skills: ['项目实战', '端到端分析', '业务洞察'],
    icon: 'BarChart',
    color: 'red',
    knowledgePoints: [
      {
        title: '购物车数据分析',
        content: '分析用户在电商平台的购物行为数据。',
        details: [
          '用户行为分析：浏览、点击、加入购物车、购买的转化漏斗',
          '购物车弃购率：分析用户为何放弃购买',
          '购物篮分析：用户同时购买的商品组合',
          '复购率分析：用户重复购买的频率',
          '客单价分析：平均每单消费金额'
        ]
      },
      {
        title: '关联规则挖掘',
        content: '发现商品之间的关联关系，用于推荐和促销。',
        details: [
          'Apriori算法：发现频繁项集',
          '支持度：项集出现的频率',
          '置信度：规则的可靠性',
          '提升度：规则的有用性',
          '应用场景：商品推荐、货架摆放、促销策略'
        ]
      },
      {
        title: '用户分群分析',
        content: '基于购物行为对用户进行分类。',
        details: [
          'RFM模型：Recency(最近购买)、Frequency(购买频率)、Monetary(消费金额)',
          '用户价值分层：高价值用户、潜力用户、流失用户',
          '个性化推荐：根据用户群体制定不同策略',
          '留存分析：不同用户群体的留存率差异',
          '营销触达：针对不同用户群体设计营销活动'
        ]
      }
    ],
    practiceCode: `# 跟着练习：购物篮分析
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

# 创建购物篮数据
data = {
    '交易ID': ['T1', 'T1', 'T1', 'T2', 'T2', 'T3', 'T3', 'T3', 'T4', 'T4'],
    '商品': ['面包', '牛奶', '鸡蛋', '面包', '牛奶', '面包', '鸡蛋', '牛奶', '牛奶', '鸡蛋']
}

df = pd.DataFrame(data)

# 转换为购物篮格式
basket = df.groupby(['交易ID', '商品'])['商品'].count().unstack().fillna(0)
basket = basket.astype(int)

# 使用Apriori算法
frequent_itemsets = apriori(basket, min_support=0.5, use_colnames=True)
rules = association_rules(frequent_itemsets, metric='lift', min_threshold=1)

print('频繁项集:')
print(frequent_itemsets)

print('\\n关联规则:')
print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']])`,
    starterCode: `# 购物车分析综合实战
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from mlxtend.frequent_patterns import apriori, association_rules

plt.rcParams['font.sans-serif'] = ['DejaVu Sans']

# === 1. 加载和预处理数据 ===
print('=== 1. 数据加载 ===')
data = pd.DataFrame({
    '用户ID': ['U1', 'U1', 'U1', 'U2', 'U2', 'U2', 'U3', 'U3', 'U4', 'U4', 'U4', 'U5', 'U5', 'U6', 'U6', 'U6'],
    '商品ID': ['P1', 'P2', 'P3', 'P1', 'P2', 'P4', 'P2', 'P3', 'P1', 'P3', 'P4', 'P1', 'P2', 'P2', 'P3', 'P4'],
    '商品类别': ['电子产品', '服装', '食品', '电子产品', '服装', '家居', '服装', '食品', '电子产品', '食品', '家居', '电子产品', '服装', '服装', '食品', '家居'],
    '价格': [299, 99, 29, 299, 99, 199, 99, 29, 299, 29, 199, 299, 99, 99, 29, 199],
    '购买日期': ['2024-01-05', '2024-01-05', '2024-01-05', '2024-01-10', '2024-01-10', '2024-01-10', '2024-01-12', '2024-01-12', '2024-01-15', '2024-01-15', '2024-01-15', '2024-01-18', '2024-01-18', '2024-01-20', '2024-01-20', '2024-01-20']
})

print('原始数据:')
print(data.head())

# === 2. 基础统计分析 ===
print('\\n=== 2. 基础统计 ===')
print(f'总交易数: {data["用户ID"].nunique()}')
print(f'总商品数: {data["商品ID"].nunique()}')
print(f'总销售额: {data["价格"].sum()}')
print(f'平均订单金额: {data.groupby("用户ID")["价格"].sum().mean():.2f}')

# === 3. 商品类别分析 ===
print('\\n=== 3. 商品类别分析 ===')
category_stats = data.groupby('商品类别')['价格'].agg(['count', 'sum', 'mean'])
print(category_stats)

plt.figure(figsize=(10, 6))
sns.barplot(x=category_stats.index, y=category_stats['sum'])
plt.title('各品类销售额')
plt.ylabel('销售额')
plt.show()

# === 4. 关联规则挖掘 ===
print('\\n=== 4. 关联规则挖掘 ===')
basket = data.groupby(['用户ID', '商品ID'])['商品ID'].count().unstack().fillna(0).astype(int)
frequent_itemsets = apriori(basket, min_support=0.3, use_colnames=True)
rules = association_rules(frequent_itemsets, metric='lift', min_threshold=1)

print('关联规则:')
print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].round(3))

# === 5. 用户价值分析 ===
print('\\n=== 5. 用户价值分析 ===')
user_value = data.groupby('用户ID').agg({
    '价格': ['sum', 'count'],
    '购买日期': 'min'
})
user_value.columns = ['总消费', '购买次数', '首次购买']
user_value['客单价'] = user_value['总消费'] / user_value['购买次数']

print('用户价值表:')
print(user_value.round(2))

# === 6. 可视化 ===
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
sns.histplot(user_value['总消费'], bins=5)
plt.title('用户消费分布')

plt.subplot(1, 2, 2)
sns.scatterplot(x=user_value['购买次数'], y=user_value['客单价'])
plt.title('购买次数与客单价关系')

plt.tight_layout()
plt.show()`,
    quiz: [
      {
        type: 'multiple',
        question: '关联规则中衡量规则可靠性的指标是？',
        options: ['支持度', '置信度', '提升度', '覆盖率'],
        correct: 1
      },
      {
        type: 'multiple',
        question: 'RFM模型中的R代表什么？',
        options: ['Recency', 'Revenue', 'Retention', 'Return'],
        correct: 0
      },
      {
        type: 'code',
        question: '使用mlxtend进行关联规则挖掘',
        hint: '使用apriori和association_rules函数'
      }
    ]
  }
];
