// 每个项目对应的「预置数据集」setupCode
// 在 Playground 每次运行前都会先执行这段代码，把 df / 相关数据注入到 Python 命名空间
// 学生在编辑器里写的代码可以直接引用 df / orders / cart / ratings 等变量

export interface ProjectDataset {
  setupCode: string;
  initialCode: string;
  description: string;
}

const p1_supermarket = `
import pandas as pd
import numpy as np
from io import StringIO

_csv = """Invoice ID,Branch,City,Customer type,Gender,Product line,Unit price,Quantity,Tax 5%,Total,Date,Time,Payment,cogs,gross margin percentage,gross income,Rating
750-67-8428,A,Yangon,Member,Female,Health and beauty,74.69,7,26.1415,548.9715,2019-01-05,13:08,Ewallet,522.83,4.761904762,26.1415,9.1
226-31-3081,C,Naypyitaw,Normal,Female,Electronic accessories,15.28,5,3.82,80.22,2019-03-08,10:29,Cash,76.4,4.761904762,3.82,9.6
631-41-3108,A,Yangon,Normal,Male,Home and lifestyle,46.33,7,16.2155,340.5255,2019-03-03,13:23,Credit card,324.31,4.761904762,16.2155,7.4
123-19-1176,A,Yangon,Normal,Male,Health and beauty,58.22,8,23.288,489.048,2019-01-27,20:33,Ewallet,465.76,4.761904762,23.288,8.4
373-73-2945,A,Yangon,Normal,Male,Sports and travel,86.31,7,30.2085,634.3785,2019-02-08,10:37,Ewallet,604.17,4.761904762,30.2085,5.3
699-14-3026,B,Mandalay,Normal,Male,Electronic accessories,85.39,7,29.8865,627.6165,2019-03-25,18:30,Ewallet,597.73,4.761904762,29.8865,4.1
355-53-6387,B,Mandalay,Normal,Female,Home and lifestyle,68.84,6,20.652,433.692,2019-02-25,14:36,Cash,413.04,4.761904762,20.652,5.8
315-22-5668,B,Mandalay,Member,Female,Home and lifestyle,73.56,10,36.78,772.38,2019-02-24,11:38,Credit card,735.6,4.761904762,36.78,8
704-65-4977,A,Yangon,Normal,Female,Food and beverages,54.84,6,16.452,345.492,2019-01-10,17:15,Ewallet,329.04,4.761904762,16.452,7.2
251-65-4938,B,Mandalay,Normal,Male,Food and beverages,14.48,4,2.896,60.816,2019-02-01,19:25,Ewallet,57.92,4.761904762,2.896,5.9
669-56-8371,B,Mandalay,Normal,Male,Fashion accessories,33.2,4,6.64,139.44,2019-03-09,18:00,Ewallet,132.8,4.761904762,6.64,7
669-56-8371,B,Mandalay,Normal,Male,Fashion accessories,33.2,4,6.64,139.44,2019-03-09,18:00,Ewallet,132.8,4.761904762,6.64,7
549-88-8248,A,Yangon,Normal,Female,Sports and travel,24.7,6,7.41,155.61,2019-01-07,16:41,Ewallet,148.2,4.761904762,7.41,5.9
131-93-6165,C,Naypyitaw,Member,Female,Electronic accessories,46.95,5,11.7375,246.4875,2019-01-05,10:15,Cash,234.75,4.761904762,11.7375,7.6
636-48-7540,A,Yangon,Normal,Male,Food and beverages,48.97,8,19.588,411.348,2019-01-25,11:42,Ewallet,391.76,4.761904762,19.588,7.2
788-30-0671,A,Yangon,Normal,Male,Health and beauty,41.65,3,6.2475,131.1975,2019-03-02,14:44,Ewallet,124.95,4.761904762,6.2475,8.5
329-62-5319,A,Yangon,Member,Female,Food and beverages,63.22,1,3.161,66.381,2019-02-12,14:34,Credit card,63.22,4.761904762,3.161,5.7
"""
df = pd.read_csv(StringIO(_csv), parse_dates=["Date"])
df["Quantity"] = pd.to_numeric(df["Quantity"], errors="coerce")
`;

const p2_cart_analysis = `
# P2：电商购物车 / 订单漏斗分析 —— 预置数据集
import pandas as pd
from io import StringIO

_cart_csv = """cart_id,user_id,product_id,product_name,category,price,quantity,added_at,removed_at,ordered_at,paid_at
C0001,U01,SKU101,iPhone 14,手机,5999,1,2024-03-01 09:10,,2024-03-01 09:22,2024-03-01 09:25
C0002,U01,SKU203,PD 快充头,配件,199,2,2024-03-01 09:12,,2024-03-01 09:22,2024-03-01 09:25
C0003,U02,SKU101,iPhone 14,手机,5999,1,2024-03-01 10:01,2024-03-01 10:05,,
C0004,U03,SKU301,AirPods Pro,耳机,1899,1,2024-03-01 11:00,,2024-03-01 11:30,
C0005,U03,SKU302,Apple Watch,手表,3199,1,2024-03-01 11:05,,2024-03-01 11:30,
C0006,U04,SKU102,MacBook Air,电脑,7999,1,2024-03-02 09:10,,,
C0007,U05,SKU201,小米手环,配件,199,3,2024-03-02 10:20,,2024-03-02 10:40,2024-03-02 10:42
C0008,U06,SKU401,Kindle,电子书,998,1,2024-03-02 11:20,2024-03-02 11:25,,
C0009,U07,SKU101,iPhone 14,手机,5999,1,2024-03-02 12:00,,2024-03-02 12:10,2024-03-02 12:12
C0010,U08,SKU301,AirPods Pro,耳机,1899,2,2024-03-02 13:00,2024-03-02 13:15,,
C0011,U09,SKU102,MacBook Air,电脑,7999,1,2024-03-03 08:00,,2024-03-03 08:20,2024-03-03 08:22
C0012,U10,SKU203,PD 快充头,配件,199,5,2024-03-03 09:00,,2024-03-03 09:30,2024-03-03 09:31
C0013,U01,SKU401,Kindle,电子书,998,1,2024-03-03 10:00,,2024-03-03 10:10,
C0014,U11,SKU101,iPhone 14,手机,5999,1,2024-03-03 10:30,,2024-03-03 10:40,2024-03-03 10:42
C0015,U12,SKU302,Apple Watch,手表,3199,1,2024-03-04 08:00,2024-03-04 08:20,,
"""

cart = pd.read_csv(StringIO(_cart_csv), parse_dates=["added_at","removed_at","ordered_at","paid_at"])
cart["subtotal"] = cart["price"] * cart["quantity"]
`;

const p3_clustering = `
# P3：学生成绩聚类分析 —— 预置数据集
import pandas as pd
import numpy as np
from io import StringIO

_student_csv = """student_id,math,chinese,english,physics,chemistry,biology,sports_score,study_hours,absent_days
S01,88,78,90,92,85,80,75,6.5,2
S02,65,72,68,58,62,70,88,4.0,5
S03,95,92,96,88,90,85,70,8.0,1
S04,55,60,58,50,55,60,85,3.0,8
S05,78,85,80,75,80,78,60,5.5,3
S06,92,88,94,95,92,88,65,7.5,0
S07,60,65,62,60,58,62,90,3.5,7
S08,85,80,82,80,85,82,55,5.0,4
S09,50,55,52,45,50,55,92,2.5,10
S10,80,75,78,82,78,80,70,6.0,2
S11,70,72,74,68,72,70,80,4.5,6
S12,98,96,99,96,94,92,50,9.0,0
S13,58,62,55,55,60,58,87,3.2,8
S14,75,78,72,70,75,72,65,5.0,5
S15,82,85,88,80,82,85,60,6.0,3
S16,68,70,65,72,68,72,78,4.2,6
S17,90,88,92,90,85,88,65,7.0,1
S18,52,58,55,55,58,55,90,3.0,9
S19,76,80,78,74,80,76,70,5.2,4
S20,84,82,86,88,84,82,65,6.8,2
"""
students = pd.read_csv(StringIO(_student_csv))
`;

const p4_rfm = `
# P4：用户 RFM 分层 —— 预置订单数据
import pandas as pd
from io import StringIO

_orders_csv = """order_id,user_id,order_date,amount,category,channel
O0001,U001,2024-02-20,699,电子,APP
O0002,U002,2024-03-10,128,服装,微信小程序
O0003,U001,2024-03-15,1580,电子,网页
O0004,U003,2024-01-05,899,家居,APP
O0005,U002,2024-03-20,459,服装,APP
O0006,U004,2024-03-01,2200,家居,APP
O0007,U001,2024-03-25,299,服装,APP
O0008,U005,2023-12-10,120,食品,APP
O0009,U006,2024-02-28,599,电子,微信小程序
O0010,U003,2024-03-18,356,食品,APP
O0011,U007,2023-10-01,980,电子,APP
O0012,U002,2024-03-22,680,家居,APP
O0013,U004,2024-03-25,1200,电子,APP
O0014,U001,2024-03-28,199,食品,微信小程序
O0015,U008,2024-01-15,450,服装,APP
O0016,U009,2024-03-30,820,家居,微信小程序
O0017,U005,2024-02-10,380,食品,APP
O0018,U010,2024-03-05,680,电子,APP
O0019,U001,2024-03-31,158,食品,APP
O0020,U011,2024-02-18,2999,电子,APP
O0021,U012,2024-01-30,88,食品,微信小程序
O0022,U013,2024-03-12,699,家居,APP
O0023,U0014,2024-03-19,1280,电子,微信小程序
O0024,U0015,2024-02-25,450,服装,APP
"""
orders = pd.read_csv(StringIO(_orders_csv), parse_dates=["order_date"])
# 假设今天是 2024-04-01，用于计算 Recency
TODAY = pd.Timestamp("2024-04-01")
`;

const p5_timeseries = `
# P5：时间序列销售预测基础 —— 预置数据集
import pandas as pd
from io import StringIO
import numpy as np

_ts_csv = """date,sales,visitors,ad_spend
2024-01-01,1200,420,800
2024-01-02,1350,450,820
2024-01-03,1280,435,810
2024-01-04,1420,468,830
2024-01-05,1600,500,850
2024-01-06,1800,560,880
2024-01-07,2100,680,920
2024-01-08,1980,640,900
2024-01-09,2050,660,910
2024-01-10,2200,700,940
2024-01-11,2350,720,950
2024-01-12,2150,680,930
2024-01-13,2400,740,960
2024-01-14,2650,820,990
2024-01-15,2300,720,920
2024-01-16,2200,700,900
2024-01-17,2400,740,930
2024-01-18,2550,780,950
2024-01-19,2800,860,980
2024-01-20,3100,960,1020
2024-01-21,3200,1000,1040
2024-01-22,2950,920,1000
2024-01-23,2800,880,980
2024-01-24,2600,820,960
2024-01-25,2700,840,970
2024-01-26,2850,880,985
2024-01-27,3050,940,1010
2024-01-28,3300,1020,1050
2024-01-29,3200,1000,1040
2024-01-30,2900,900,990
2024-01-31,2700,840,970
"""
sales = pd.read_csv(StringIO(_ts_csv), parse_dates=["date"], index_col="date")
`;

const p6_movie_corr = `
# P6：电影评分相关性分析 —— 预置数据集
import pandas as pd
from io import StringIO

# 5 个用户对 5 部电影的评分（1-5），0 代表未评分
_ratings_csv = """user_id,The_Great_Gatsby,Inception,Interstellar,Titanic,Avatar
U01,4,5,5,4,5
U02,3,4,5,5,4
U03,5,5,4,3,3
U04,4,4,4,4,4
U05,2,5,5,5,5
U06,3,4,4,4,5
U07,4,5,5,3,4
U08,5,4,4,2,3
U09,3,5,5,5,5
U10,4,4,5,4,4
"""
ratings = pd.read_csv(StringIO(_ratings_csv), index_col="user_id")
`;

const p7_titanic = `
# P7：泰坦尼克生存特征工程 —— 预置数据集
import pandas as pd
from io import StringIO

_titanic_csv = """PassengerId,Survived,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Cabin,Embarked
1,0,3,"Braund, Mr. Owen Harris",male,22,1,0,A/5 21171,7.25,,S
2,1,1,"Cumings, Mrs. John Bradley (Florence Briggs Thayer)",female,38,1,0,PC 17599,71.2833,C85,C
3,1,3,"Heikkinen, Miss. Laina",female,26,0,0,STON/O2. 3101282,7.925,,S
4,1,1,"Futrelle, Mrs. Jacques Heath (Lily May Peel)",female,35,1,0,113803,53.1,C123,S
5,0,3,"Allen, Mr. William Henry",male,35,0,0,373450,8.05,,S
6,0,3,"Moran, Mr. James",male,,0,0,330877,8.4583,,Q
7,0,1,"McCarthy, Mr. Timothy J",male,54,0,0,17463,51.8625,E46,S
8,0,3,"Palsson, Master. Gosta Leonard",male,2,3,1,349909,21.075,,S
9,1,3,"Johnson, Mrs. Oscar W (Elisabeth Vilhelmina Berg)",female,27,0,2,347742,11.1333,,S
10,1,2,"Nasser, Mrs. Nicholas (Adele Achem)",female,14,1,0,237736,30.0708,,C
11,1,3,"Sandstrom, Miss. Marguerite Rut",female,4,1,1,PP 9549,16.7,,S
12,1,1,"Bonnell, Miss. Elizabeth",female,58,0,0,113783,26.55,C103,S
13,0,3,"Saundercock, Mr. William Henry",male,20,0,0,A/5. 2151,8.05,,S
14,0,3,"Andersson, Mr. Anders Johan",male,39,1,5,347082,31.275,,S
15,0,3,"Vestrom, Miss. Hulda Amanda Adolfina",female,14,0,0,350406,7.8542,,S
16,1,2,"Hewlett, Mrs. (Mary D Kingcome) ",female,55,0,0,248706,16,,S
17,0,3,"Rice, Master. Eugene",male,2,4,1,382652,29.125,,Q
18,1,2,"Williams, Mr. Charles Eugene",male,,0,0,244373,13,,S
19,0,3,"Vander Planke, Mrs. Julius (Emelia Maria Vandemoortele)",female,31,1,0,345763,18,,S
20,1,3,"Masselmani, Mrs. Fatima",female,,0,0,2649,7.225,,C
"""
titanic = pd.read_csv(StringIO(_titanic_csv))
`;

const p8_abtest = `
# P8：订单 A/B 测试 —— 预置数据集
import pandas as pd
from io import StringIO

_ab_csv = """group,user_id,converted,order_amount,age_bucket
control,U0001,1,299,18-24
control,U0002,0,0,25-34
control,U0003,1,450,25-34
control,U0004,0,0,35-44
control,U0005,1,680,45+
control,U0006,0,0,18-24
control,U0007,1,320,25-34
control,U0008,0,0,35-44
control,U0009,1,820,25-34
control,U00010,0,0,18-24
control,U00011,1,560,35-44
control,U00012,0,0,45+
control,U00013,1,200,18-24
control,U00014,0,0,25-34
control,U00015,1,980,25-34
treatment,U0101,1,820,18-24
treatment,U0102,0,0,25-34
treatment,U0103,1,1200,25-34
treatment,U0104,0,0,35-44
treatment,U0105,1,560,45+
treatment,U0106,0,0,18-24
treatment,U0107,1,890,25-34
treatment,U0108,0,0,35-44
treatment,U0109,1,1500,25-34
treatment,U0110,0,0,18-24
treatment,U0111,1,690,35-44
treatment,U0112,0,0,45+
treatment,U0113,1,420,18-24
treatment,U0114,0,0,25-34
treatment,U0115,1,1200,25-34
"""
ab = pd.read_csv(StringIO(_ab_csv))
`;

const p9_reviews = `
# P9：商品评论文本分析 —— 预置数据集
import pandas as pd
from io import StringIO

_reviews_csv = """review_id,product,rating,text
R001,耳机,5,"音效非常好，低音澎湃，戴着很舒适，强烈推荐！"
R002,耳机,3,"音质一般，佩戴有点夹头，价格还算合理。"
R003,手机,5,"屏幕素质一流，续航也很好，系统流畅。"
R004,手机,2,"信号有问题，摄像头夜间拍得很模糊，不推荐。"
R005,平板,4,"性价比不错，用来追剧看书非常合适。"
R006,平板,1,"用了两周就卡到爆，做工也很一般。"
R007,耳机,4,"降噪效果不错，性价比高，但续航略短。"
R008,手机,4,"整体满意，只是价格稍微偏高。"
R009,手表,5,"外观精致，运动监测很准确，推荐购买。"
R010,手表,2,"表带几天就脱皮，售后也很敷衍。"
R011,耳机,3,"声音还行，但连接偶有断连，中规中矩。"
R012,手机,5,"用了半年依旧流畅，拍照一流。"
R013,平板,5,"轻薄便携，做笔记阅读都很舒服。"
R014,手表,3,"颜值不错，功能比较鸡肋，看个人需求。"
R015,耳机,2,"听诊器效应明显，不推荐运动使用。"
R016,手机,4,"手感好，充电快，只是屏幕有点黄。"
"""
reviews = pd.read_csv(StringIO(_reviews_csv))
`;

const p10_bikes = `
# P10：共享单车综合洞察 —— 预置数据集
import pandas as pd
from io import StringIO
import numpy as np

_bike_csv = """datetime,season,holiday,workingday,weather,temp,atemp,humidity,windspeed,casual,registered,count
2012-01-01 00:00:00,1,0,0,1,9.84,14.395,81,0,3,13,16
2012-01-01 01:00:00,1,0,0,1,9.02,13.635,80,0,8,32,40
2012-01-01 02:00:00,1,0,0,1,9.02,13.635,80,0,5,27,32
2012-01-01 03:00:00,1,0,0,1,9.84,14.395,75,0,3,10,13
2012-01-01 04:00:00,1,0,0,1,9.84,14.395,75,0,0,1,1
2012-01-01 05:00:00,1,0,0,2,9.84,12.88,75,6.0032,0,1,1
2012-01-01 06:00:00,1,0,0,1,9.02,13.635,80,0,2,0,2
2012-01-01 07:00:00,1,0,0,1,8.2,12.88,86,0,1,2,3
2012-01-01 08:00:00,1,0,0,1,9.84,14.395,75,0,1,7,8
2012-01-01 09:00:00,1,0,0,1,13.12,17.425,76,0,8,6,14
2012-01-01 10:00:00,1,0,0,1,15.58,19.695,76,16.9979,12,24,36
2012-01-01 11:00:00,1,0,0,1,14.76,16.665,81,19.0012,26,30,56
2012-01-01 12:00:00,1,0,0,2,17.22,21.21,77,19.0012,29,41,70
2012-01-01 13:00:00,1,0,0,1,18.86,22.725,72,19.9995,47,52,99
2012-01-01 14:00:00,1,0,0,1,18.86,22.725,72,15.0013,35,52,87
2012-01-01 15:00:00,1,0,0,1,18.04,21.97,77,19.0012,40,48,88
2012-01-01 16:00:00,1,0,0,2,17.22,21.21,82,19.9995,26,49,75
2012-01-01 17:00:00,1,0,0,1,18.86,22.725,72,15.0013,29,47,76
2012-01-01 18:00:00,1,0,0,1,18.04,21.97,77,19.0012,15,45,60
2012-01-01 19:00:00,1,0,0,1,17.22,21.21,82,19.9995,9,28,37
2012-01-01 20:00:00,1,0,0,1,16.4,20.455,82,12.998,8,17,25
2012-01-01 21:00:00,1,0,0,1,16.4,20.455,82,12.998,5,17,22
2012-01-01 22:00:00,1,0,0,1,18.86,22.725,72,6.0032,10,20,30
2012-01-01 23:00:00,1,0,0,1,18.04,21.97,77,11.0014,4,17,21
2012-01-02 00:00:00,1,0,1,1,16.4,20.455,82,12.998,5,9,14
2012-01-02 01:00:00,1,0,1,1,15.58,19.695,82,11.0014,2,29,31
2012-01-02 02:00:00,1,0,1,1,14.76,18.94,77,15.0013,1,19,20
2012-01-02 03:00:00,1,0,1,2,14.76,18.94,77,12.998,0,5,5
2012-01-02 04:00:00,1,0,1,2,13.94,17.425,82,12.998,2,9,11
2012-01-02 05:00:00,1,0,1,2,13.94,17.425,82,12.998,3,15,18
"""
bikes = pd.read_csv(StringIO(_bike_csv), parse_dates=["datetime"])
bikes["hour"] = bikes["datetime"].dt.hour
bikes["dayofweek"] = bikes["datetime"].dt.dayofweek
`;

export const DATASETS: Record<string, ProjectDataset> = {
  p1: {
    setupCode: p1_supermarket,
    initialCode: `# 超市销售数据清洗与探索\n# df 已预加载\nprint("数据行数：", len(df))\nprint("列名：", list(df.columns))\nprint("\\n前 3 行：")\ndf.head(3)`,
    description: "超市销售样本数据（约 20 行，含日期/金额/评分）",
  },
  p2: {
    setupCode: p2_cart_analysis,
    initialCode: `# 电商购物车 / 订单漏斗\nprint("购物车记录：", len(cart))\nprint("列名：", list(cart.columns))\nprint("\\n前 3 行：")\ncart.head(3)`,
    description: "电商购物车样本（含加购/下单/支付时间戳）",
  },
  p3: {
    setupCode: p3_clustering,
    initialCode: `# 学生成绩数据集（20 名学生，8 门课 + 学习行为）\nprint("学生数：", len(students))\nstudents.describe().T`,
    description: "学生成绩样本数据（含数学/语文/英语等）",
  },
  p4: {
    setupCode: p4_rfm,
    initialCode: `# 订单数据（24 条订单，覆盖 15 位用户）\nprint("订单数：", len(orders))\nprint("用户数：", orders.user_id.nunique())\norders.head(5)`,
    description: "电商订单样本（用于 RFM 分层）",
  },
  p5: {
    setupCode: p5_timeseries,
    initialCode: `# 31 天销售时间序列\nprint("天数：", len(sales))\nprint("前 5 天：")\nsales.head()`,
    description: "电商月度销售时间序列（含访客数/广告投入）",
  },
  p6: {
    setupCode: p6_movie_corr,
    initialCode: `# 10 个用户对 5 部电影的评分\nprint("用户数：", len(ratings))\nprint("电影：", list(ratings.columns))\nprint("\\n评分矩阵：")\nratings`,
    description: "用户-电影评分矩阵（10x5）",
  },
  p7: {
    setupCode: p7_titanic,
    initialCode: `# 泰坦尼克生存样本\nprint("乘客数：", len(titanic))\nprint("生存率：", round(titanic.Survived.mean(), 3))\ntitanic.head(3)`,
    description: "Kaggle Titanic 训练集子集（20 行）",
  },
  p8: {
    setupCode: p8_abtest,
    initialCode: `# A/B 测试：对照组 vs 实验组\nprint("总数：", len(ab))\nprint("分组样本：")\nab.groupby("group")["converted"].agg(["count","mean","sum"])`,
    description: "A/B 测试订单转化数据（control / treatment 各 15 条）",
  },
  p9: {
    setupCode: p9_reviews,
    initialCode: `# 商品中文评论\nprint("评论数：", len(reviews))\nprint("评分分布：")\nreviews["rating"].value_counts().sort_index()\nprint("\\n前 3 条评论：")\nreviews[["product","rating","text"]].head(3)`,
    description: "商品中文评论（含 rating、产品分类）",
  },
  p10: {
    setupCode: p10_bikes,
    initialCode: `# 共享单车小时级租借数据\nprint("记录数：", len(bikes))\nprint("温度范围：", bikes["temp"].min(), "~", bikes["temp"].max())\nprint("\\n按季节统计平均租借量：")\nbikes.groupby("season")["count"].mean().round(1)`,
    description: "Kaggle Bike Sharing 子集（含时间/天气/季节等）",
  },
};

// 给项目列表页用的「技术标签」信息，放在 datasets 中便于统一管理
export const TECH_TAGS: Record<string, string[]> = {
  p1: ["pandas", "缺失值", "重复值", "describe", "groupby"],
  p2: ["购物车分析", "漏斗分析", "弃购率", "时间差"],
  p3: ["K-Means", "聚类", "标准化", "silhouette"],
  p4: ["RFM", "分箱", "用户分层"],
  p5: ["时间序列", "移动平均", "同比环比"],
  p6: ["相关性", "推荐系统", "协同过滤直觉"],
  p7: ["特征工程", "缺失值填充", "分组中位数"],
  p8: ["A/B 测试", "卡方检验", "辛普森悖论"],
  p9: ["文本分析", "分词", "停用词"],
  p10: ["综合分析", "聚类+时序"],
};
