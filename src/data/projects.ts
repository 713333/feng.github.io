export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  codeHint?: string;
  question?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  difficulty: "入门" | "进阶" | "综合";
  summary: string;
  datasetUrl: string;
  datasetDesc: string;
  techTags: string[];
  objective: string[];
  steps: ProjectStep[];
}

export const projects: Project[] = [
  {
    id: "p1",
    title: "超市销售数据清洗与探索分析",
    category: "数据清洗 · 探索性分析",
    difficulty: "入门",
    summary:
      "从一份「看起来很乱」的超市销售 CSV 出发，系统地完成缺失值识别、重复值剔除、异常值检测、字段类型矫正，最终输出一份可用于后续建模的干净数据与基础统计洞察。",
    datasetUrl: "https://www.kaggle.com/datasets/aungpyaeap/supermarket-sales",
    datasetDesc: "Kaggle · Supermarket Sales（约 1000 行，17 字段，含日期/销售额/毛利率等）",
    techTags: ["pandas", "缺失值", "重复值", "describe", "groupby"],
    objective: [
      "掌握 pd.read_csv 的参数与常见读取陷阱",
      "掌握 isnull / dropna / fillna 的选择策略",
      "学会使用 duplicated / drop_duplicates 去重",
      "使用 boxplot / describe 识别异常值",
      "用 groupby + agg 做快速业务洞察",
    ],
    steps: [
      {
        id: "p1s1",
        title: "读取数据并做「第一次体检」",
        description:
          "读取超市销售数据后，立刻用 info() 看字段与类型，用 head() / tail() 看前后样本，用 describe() 查看数值型列的分布。养成习惯：任何数据在动手前，都要先做这三步。",
        codeHint: `import pandas as pd

df = pd.read_csv("supermarket_sales.csv")
print(df.shape)
print(df.info())
print(df.describe(include="all").T)`,
        question: "从 info() 的输出中，你能直接看出哪些字段存在缺失吗？为什么？",
      },
      {
        id: "p1s2",
        title: "缺失值识别与处理决策",
        description:
          "统计每一列的缺失数量和占比。思考：缺失是「真缺失（无值）」还是「空字符串」？对不同字段采取不同策略：数值型用中位数或 0，分类字段用众数或 'Unknown'。",
        codeHint: `missing = df.isnull().sum().to_frame("n_missing")
missing["pct"] = missing["n_missing"] / len(df) * 100
print(missing[missing["n_missing"] > 0])

# 对不同字段采取不同策略
df["Rating"] = df["Rating"].fillna(df["Rating"].median())
df["City"] = df["City"].fillna("Unknown")`,
        question: "什么时候应该直接 dropna，什么时候应该 fillna？请举 1 个业务上的例子。",
      },
      {
        id: "p1s3",
        title: "重复值检测与去除",
        description:
          "业务系统导出的数据常常有重复行。使用 duplicated(subset=...) 定位，思考：是整行重复才叫重复，还是「订单 ID 相同」就视为重复？",
        codeHint: `dup_mask = df.duplicated(subset=["Invoice ID"], keep=False)
print("疑似重复订单数：", dup_mask.sum())

df_clean = df.drop_duplicates(subset=["Invoice ID"], keep="first").reset_index(drop=True)`,
        question: "如果没有唯一 ID 字段，你会如何定义「重复」？",
      },
      {
        id: "p1s4",
        title: "异常值检测（IQR + 业务逻辑双重验证）",
        description:
          "用 IQR 方法得到上/下四分位边界，再结合业务常识二次判断（例如毛利率不可能 > 100%，销售额不可能为负）。异常值不要一删了之，先记录再决策。",
        codeHint: `Q1 = df_clean["Total"].quantile(0.25)
Q3 = df_clean["Total"].quantile(0.75)
IQR = Q3 - Q1
lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR

outliers = df_clean[(df_clean["Total"] < lower) | (df_clean["Total"] > upper)]
print(f"销售额异常样本：{len(outliers)} 条")

# 保留异常但打上标记（而不是直接删除），后续可单独分析
df_clean["is_total_outlier"] = (
    (df_clean["Total"] < lower) | (df_clean["Total"] > upper)
).astype(int)`,
        question: "为什么不建议一上来就删除异常值？它可能代表什么业务含义？",
      },
      {
        id: "p1s5",
        title: "字段类型矫正（日期/类别/数值）",
        description:
          "许多 CSV 读取后日期会变成 object，分类字段可能是字符串。使用 to_datetime、astype('category')、pd.to_numeric(errors='coerce') 矫正类型，能大幅提升后续分析效率与内存占用。",
        codeHint: `df_clean["Date"] = pd.to_datetime(df_clean["Date"])
df_clean["Branch"] = df_clean["Branch"].astype("category")
df_clean["gross income"] = pd.to_numeric(df_clean["gross income"], errors="coerce")

print(df_clean.dtypes)`,
        question: "category 类型相比 object，在什么情况下最有收益？",
      },
      {
        id: "p1s6",
        title: "分组聚合：快速输出业务洞察",
        description:
          "分别按「分店」「产品线」「性别」分组，计算销售额、毛利率、评分的均值与中位数。完成数据清洗的第一步成果，就是让这些聚合结果「看起来合理」。",
        codeHint: `report = (
    df_clean
    .groupby("Product line", as_index=False)
    .agg(
        n=("Invoice ID", "count"),
        total_sales=("Total", "sum"),
        avg_margin=("gross margin percentage", "mean"),
        avg_rating=("Rating", "mean"),
    )
    .sort_values("total_sales", ascending=False)
)
print(report.round(2))`,
        question: "这份报告中，如果发现某条产品线销售额高但评分低，你会如何向业务方解读？",
      },
    ],
  },

  {
    id: "p2",
    title: "电商购物车行为分析",
    category: "购物车分析 · 转化漏斗",
    difficulty: "入门",
    summary:
      "用电商「用户-购物车-下单」的数据，分析商品加入购物车后最终被结算的比例，定位「弃购率」高的品类与时间段，输出一份可直接给到运营同学的购物车健康度报告。",
    datasetUrl: "https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce",
    datasetDesc: "Kaggle · Brazilian E-Commerce（可基于 order_items + orders 构造购物车视角）",
    techTags: ["漏斗分析", "cart-abandonment", "groupby", "pivot_table"],
    objective: [
      "理解「加购 → 下单 → 支付」的漏斗口径",
      "计算购物车弃购率（Abandonment Rate）",
      "能按品类 / 时间 / 设备切分看差异",
      "用 pivot_table 输出可读的运营报告",
    ],
    steps: [
      {
        id: "p2s1",
        title: "理解数据并构造「购物车快照」",
        description:
          "电商原始数据里，常常见不到真正的 cart 表，而是「用户 × 商品 × 时间」的行为日志。我们需要先定义：同一用户在同一 session 加入的商品视为一个购物车。",
        codeHint: `# 假设已有 cart_logs: user_id, item_id, category, added_at, is_ordered
cart_logs = pd.read_csv("cart_logs.csv")
cart_logs["added_at"] = pd.to_datetime(cart_logs["added_at"])

# 每个购物车聚合一行
carts = (
    cart_logs
    .groupby(["user_id", "session_id"], as_index=False)
    .agg(
        n_items=("item_id", "count"),
        categories=("category", lambda s: ",".join(sorted(set(s)))),
        has_order=("is_ordered", "max"),   # 任意一件下单即视为该购物车有转化
        added_first=("added_at", "min"),
    )
)`,
        question: "如果没有 session_id，你会如何近似划分购物车？",
      },
      {
        id: "p2s2",
        title: "计算「加购 - 下单」两步漏斗",
        description:
          "计算总体加购数、下单数，并分别输出「加购即弃购比例」和「下单中完整支付的比例」。漏斗图是向业务方沟通最高效的语言。",
        codeHint: `n_cart_added = len(cart_logs)           # 加购行总数
n_in_order = cart_logs["is_ordered"].sum()  # 最终被下单的加购行

abandonment_rate = 1 - n_in_order / n_cart_added
print(f"总体加购数：{n_cart_added}，其中下单数：{n_in_order}，弃购率：{abandonment_rate:.1%}")`,
        question: "为什么有时候「按行统计弃购率」与「按购物车统计弃购率」会不同？哪个更适合业务沟通？",
      },
      {
        id: "p2s3",
        title: "按品类切分，定位问题品类",
        description:
          "分组计算每个品类的弃购率。弃购率高的品类往往是调研重点：价格、运费、库存、页面体验都是可能的原因。",
        codeHint: `by_cat = (
    cart_logs
    .groupby("category")
    .agg(added=("item_id", "count"), ordered=("is_ordered", "sum"))
    .assign(abandonment=lambda d: 1 - d["ordered"] / d["added"])
    .sort_values("abandonment", ascending=False)
)
print(by_cat.round(3))`,
        question: "如果品类 A 弃购率最高但加购量很小，品类 B 弃购率中等但加购量巨大，运营上优先级应该怎么排？",
      },
      {
        id: "p2s4",
        title: "按时间段切分：找到弃购高发时段",
        description:
          "以小时为粒度查看加购与下单情况。某些时段（如深夜、午休）用户可能只是先收藏，未必会立刻支付。这对活动排期、客服排班有直接指导意义。",
        codeHint: `cart_logs["hour"] = cart_logs["added_at"].dt.hour
by_hour = (
    cart_logs
    .groupby("hour")
    .agg(added=("item_id", "count"), ordered=("is_ordered", "sum"))
    .assign(abandonment=lambda d: 1 - d["ordered"] / d["added"])
)
print(by_hour.sort_values("abandonment", ascending=False).head(5))`,
        question: "如果发现 23:00-01:00 弃购率异常高，可能的业务假设是什么？如何验证？",
      },
      {
        id: "p2s5",
        title: "输出运营可用的透视表",
        description:
          "用 pivot_table 将「品类 × 小时」的弃购率打平，业务同事可以直接拿去做 Excel 可视化。",
        codeHint: `pivot = pd.pivot_table(
    cart_logs,
    index="category",
    columns="hour",
    values="is_ordered",
    aggfunc=lambda s: 1 - s.mean(),  # 1 - 下单率 = 弃购率
)
print(pivot.round(2))`,
        question: "当某些「品类 × 小时」样本很小时，透视表的值应该如何处理才能更稳健？",
      },
    ],
  },

  {
    id: "p3",
    title: "学生成绩聚类分析",
    category: "聚类分析 · 特征工程",
    difficulty: "进阶",
    summary:
      "基于学生成绩、出勤、家庭背景等多维数据，使用 K-Means 将学生分为若干群体，并用均值/中位数对比各群体特征，最终给出一份「不同学习风格画像」报告，用于个性化辅导。",
    datasetUrl: "https://archive.ics.uci.edu/dataset/320/student+performance",
    datasetDesc: "UCI · Student Performance（395 名学生，含成绩/家庭/出勤等 33 个字段）",
    techTags: ["KMeans", "StandardScaler", "Elbow Method", "聚类解读"],
    objective: [
      "会做数值/分类特征的工程化（one-hot / 标准化）",
      "掌握 StandardScaler + KMeans 的标准流程",
      "能用 Elbow Method 确定 K",
      "能对聚类结果做业务解读，而不是只给标签",
    ],
    steps: [
      {
        id: "p3s1",
        title: "特征选择与特征工程",
        description:
          "挑出与「学习表现」相关的字段：考试成绩、缺勤次数、学习时长、家庭支持等。对分类字段做 one-hot 或 ordinal encoding，对数值字段做标准化。",
        codeHint: `from sklearn.preprocessing import StandardScaler

num_cols = ["G1", "G2", "G3", "absences", "studytime"]
cat_cols = ["school", "sex", "address", "famsize", "Pstatus", "schoolsup", "famsup"]

X_num = df[num_cols]
X_cat = pd.get_dummies(df[cat_cols], drop_first=True).astype(int)
X = pd.concat([X_num, X_cat], axis=1)

X_scaled = StandardScaler().fit_transform(X)`,
        question: "为什么聚类前要做标准化？如果不做会发生什么？",
      },
      {
        id: "p3s2",
        title: "用 Elbow Method 决定簇的数量",
        description:
          "尝试 K=1..10，记录每个 K 对应的 inertia（样本到各自簇中心的距离平方和），画折线图寻找「拐点」。这是选择 K 最朴素也最实用的方法。",
        codeHint: `import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertias.append(km.inertia_)

plt.plot(range(1, 11), inertias, marker="o")
plt.xlabel("K"); plt.ylabel("Inertia")
plt.title("Elbow Method")
plt.show()`,
        question: "除了 Elbow，你还知道哪些判断聚类数目的方法？（例如 Silhouette Score）",
      },
      {
        id: "p3s3",
        title: "训练 K-Means 并把标签打回原表",
        description:
          "选定 K=4，训练模型，预测每个样本所属的簇。注意「簇编号」没有顺序含义，解读时要以簇内特征分布来命名群体。",
        codeHint: `km = KMeans(n_clusters=4, random_state=42, n_init=10)
df["cluster"] = km.fit_predict(X_scaled)
print(df["cluster"].value_counts().sort_index())`,
        question: "cluster 列的值是 0/1/2/3，这些数字有大小含义吗？为什么？",
      },
      {
        id: "p3s4",
        title: "解读聚类：各簇在关键指标上的差异",
        description:
          "分组统计各簇在成绩（G3）、缺勤次数、学习时长上的均值，并结合分类字段的分布，给每个簇起一个「业务名字」，例如「高努力型」「缺勤偏高型」等。",
        codeHint: `profile = (
    df
    .groupby("cluster")
    .agg(
        n=("G3", "count"),
        avg_score=("G3", "mean"),
        avg_absences=("absences", "mean"),
        avg_studytime=("studytime", "mean"),
        famsupport_rate=("famsup", lambda s: (s == "yes").mean()),
    )
    .round(2)
)
print(profile)`,
        question: "你会给这 4 个 cluster 各自起什么名字？理由是什么？",
      },
      {
        id: "p3s5",
        title: "输出洞察：指导老师如何干预",
        description:
          "结合画像给出建议：如「聚类 2 缺勤高且成绩差 → 加强家校沟通」「聚类 3 成绩高但学习时长短 → 可引导挑战更高难度」。聚类本身不是结论，业务建议才是价值所在。",
        codeHint: `# 纯文字解读：按你的画像写出 3-5 条可执行建议
# 例如：
# · 对缺勤率最高的 cluster，组织一次家庭访谈 + 学业预警
# · 对高成绩但学习时间少的 cluster，引入竞赛/拓展课程
# · 对整体偏弱的 cluster，提供课后补习与同伴学习小组`,
        question: "请基于你看到的 profile 数据，写出 3 条具体可执行的教学干预建议。",
      },
    ],
  },

  {
    id: "p4",
    title: "用户消费行为 RFM 分析",
    category: "RFM · 用户分层",
    difficulty: "进阶",
    summary:
      "基于订单明细，计算每位用户的 Recency（最近一次消费距今多少天）、Frequency（消费频次）、Monetary（累计消费金额），按分箱打 1-5 分，输出 5×5×5 = 125 组并合并为 8 个运营分层，指导营销策略。",
    datasetUrl: "https://archive.ics.uci.edu/dataset/502/online+retail+ii",
    datasetDesc: "UCI · Online Retail II（约 100 万行，跨 2 年的跨境电商订单）",
    techTags: ["RFM", "qcut", "用户分层", "Recency/Frequency/Monetary"],
    objective: [
      "掌握 Recency / Frequency / Monetary 三指标的计算方法",
      "会用 qcut / 自定义分位数做分箱",
      "能根据 R/F/M 分值合成 8 段运营分层",
      "能输出给市场/运营使用的名单与策略建议",
    ],
    steps: [
      {
        id: "p4s1",
        title: "清洗订单数据",
        description:
          "滤除取消订单（InvoiceNo 带 C）、缺失 CustomerID 的记录，修正金额字段为数值型。RFM 必须基于「真实已支付订单」。",
        codeHint: `retail = pd.read_csv("online_retail_II.csv")
retail["InvoiceDate"] = pd.to_datetime(retail["InvoiceDate"])

# 只保留正向订单、有用户 ID 的行
retail = retail[
    (~retail["Invoice"].str.startswith("C", na=False))
    & retail["Customer ID"].notna()
].copy()
retail["Customer ID"] = retail["Customer ID"].astype(int)
retail["amount"] = retail["Quantity"] * retail["Price"]`,
        question: "为什么必须剔除取消订单？保留它们会对 R/F/M 各产生什么影响？",
      },
      {
        id: "p4s2",
        title: "计算每个用户的 R / F / M",
        description:
          "以「数据集中的最晚日期 + 1 天」为观察日，对每个用户：Recency = 观察日 - 最近一次下单日；Frequency = 订单数或发票数；Monetary = 该用户累计金额。",
        codeHint: `snapshot_date = retail["InvoiceDate"].max() + pd.Timedelta(days=1)

rfm = (
    retail
    .groupby("Customer ID")
    .agg(
        Recency=("InvoiceDate", lambda d: (snapshot_date - d.max()).days),
        Frequency=("Invoice", "nunique"),
        Monetary=("amount", "sum"),
    )
    .reset_index()
)
print(rfm.describe())`,
        question: "Frequency 用「发票数」和「商品行数」有什么区别？为什么通常用发票？",
      },
      {
        id: "p4s3",
        title: "R / F / M 分箱打 1-5 分",
        description:
          "Recency：越小越好（越近越好），所以分箱后倒序打分；Frequency 与 Monetary：越大越好，直接升序打分。使用 qcut 按分位数切分，保证每组人数近似。",
        codeHint: `rfm["R_score"] = pd.qcut(rfm["Recency"], q=5, labels=[5,4,3,2,1]).astype(int)
rfm["F_score"] = pd.qcut(rfm["Frequency"].rank(method="first"), q=5, labels=[1,2,3,4,5]).astype(int)
rfm["M_score"] = pd.qcut(rfm["Monetary"].rank(method="first"), q=5, labels=[1,2,3,4,5]).astype(int)
rfm["RFM_cell"] = rfm["R_score"].astype(str) + rfm["F_score"].astype(str) + rfm["M_score"].astype(str)`,
        question: "为什么 Frequency/Monetary 在 qcut 前用 rank(method='first')？什么情况下会报错？",
      },
      {
        id: "p4s4",
        title: "合并为 8 个运营分层",
        description:
          "常用做法：先判断 R 是否 ≥ 4（「活跃」vs「沉睡」），再结合 F、M。典型分层有：重要价值、重要召回、一般价值、新人、流失预警等。",
        codeHint: `def segment(row):
    r, f, m = row["R_score"], row["F_score"], row["M_score"]
    if r >= 4 and f >= 4 and m >= 4: return "⭐ 重要价值用户"
    if r >= 4 and f <= 2:          return "🆕 新用户 / 低频活跃"
    if r <= 2 and f >= 4 and m >= 4: return "⚠️ 重要流失预警"
    if r <= 2:                      return "💤 已沉睡"
    if f >= 4 and m >= 4:           return "💰 高价值活跃"
    if m >= 4:                      return "🧲 高消费但频次一般"
    return "🟰 普通用户"

rfm["segment"] = rfm.apply(segment, axis=1)
print(rfm["segment"].value_counts())`,
        question: "请为「重要流失预警」人群写一句可以直接发给运营的话术建议。",
      },
      {
        id: "p4s5",
        title: "输出名单与策略报告",
        description:
          "针对每个 segment，计算该段的平均 R/F/M 与人数，并输出该段用户 ID 列表（csv），供邮件/短信营销系统直接使用。",
        codeHint: `seg_report = (
    rfm
    .groupby("segment")
    .agg(
        users=("Customer ID", "count"),
        avg_R=("Recency", "mean"),
        avg_F=("Frequency", "mean"),
        avg_M=("Monetary", "mean"),
    )
    .round(1)
    .sort_values("avg_M", ascending=False)
)
print(seg_report)

# rfm[rfm["segment"] == "重要流失预警"][["Customer ID"]].to_csv("list_warning.csv", index=False)`,
        question: "如果让你只选一个 segment 做一次促销，你会选谁？怎么衡量活动是否成功？",
      },
    ],
  },

  {
    id: "p5",
    title: "时序销售预测基础：移动平均 + 同比环比",
    category: "时间序列",
    difficulty: "进阶",
    summary:
      "按日/周/月聚合销售数据，计算同比（YoY）、环比（MoM），使用简单移动平均（SMA）与指数移动平均（EWMA）做下一步预测，并讨论这些方法的适用性与局限。",
    datasetUrl: "https://www.kaggle.com/datasets/rohitsahoo/sales-forecasting",
    datasetDesc: "Kaggle · Store Item Demand Forecasting（店铺 × 商品 × 日）",
    techTags: ["resample", "rolling", "ewm", "YoY/MoM", "时序可视化"],
    objective: [
      "会使用 resample 将高粒度数据聚合到日/周/月",
      "能用 rolling / ewm 计算移动平均",
      "会计算同比/环比，能识别是否具有季节性",
      "能口头解释「简单移动平均 vs 指数移动平均」的差异",
    ],
    steps: [
      {
        id: "p5s1",
        title: "将交易流水按日聚合",
        description:
          "原始订单通常是一行一件商品，我们先用日期分组，得到每日销售额序列。设置日期为索引后，后续所有时序函数都能直接使用。",
        codeHint: `orders = pd.read_csv("sales.csv", parse_dates=["date"], index_col="date")
daily = orders.resample("D")["revenue"].sum().to_frame("revenue")
print(daily.head(10))`,
        question: "resample 的常用频率有哪些（日/周/月/季/年）？它们的英文缩写是什么？",
      },
      {
        id: "p5s2",
        title: "简单移动平均 SMA(7) / SMA(30)",
        description:
          "7 日均线可以平滑掉周末效应；30 日均线代表中期趋势。rolling 的窗口可以灵活指定；注意窗口越大会越滞后。",
        codeHint: `daily["sma7"] = daily["revenue"].rolling(7).mean()
daily["sma30"] = daily["revenue"].rolling(30).mean()
daily[["revenue", "sma7", "sma30"]].plot(figsize=(12, 4))`,
        question: "移动平均为什么会「滞后」？如何直观理解它的滞后天数？",
      },
      {
        id: "p5s3",
        title: "指数加权移动平均 EWMA",
        description:
          "EWMA 对越近的数据赋予越高权重，比 SMA 更「灵敏」。span 参数大致对应窗口概念：span 越大越平滑。",
        codeHint: `daily["ewm7"] = daily["revenue"].ewm(span=7, adjust=False).mean()
daily[["revenue", "sma7", "ewm7"]].plot(figsize=(12, 4))`,
        question: "adjust=False 是什么意思？为什么在做滚动预测时更常使用它？",
      },
      {
        id: "p5s4",
        title: "同比 / 环比",
        description:
          "按周聚合后，周环比 shift(1)、周同比 shift(52)。同比能抵消季节性，是业务汇报时最常用的指标之一。",
        codeHint: `weekly = daily.resample("W")["revenue"].sum().to_frame("revenue")
weekly["mom"] = weekly["revenue"].pct_change(1)        # 环比
weekly["yoy"] = weekly["revenue"].pct_change(52)       # 同比（假设 52 周=1 年）
print(weekly.tail(10).round(3))`,
        question: "pct_change 的结果如果出现 inf 或 NaN，可能原因是什么？你会怎么处理？",
      },
      {
        id: "p5s5",
        title: "用移动平均做一步预测（朴素基线）",
        description:
          "把上一期的 EWMA 当作下一期的预测值，计算 MAE / MAPE，得到一个「朴素基线模型」。任何更复杂模型都应该能跑赢它。",
        codeHint: `weekly["pred"] = weekly["revenue"].ewm(span=4, adjust=False).mean().shift(1)
weekly = weekly.dropna()

mae = (weekly["revenue"] - weekly["pred"]).abs().mean()
mape = ((weekly["revenue"] - weekly["pred"]).abs() / weekly["revenue"]).mean()
print(f"MAE = {mae:.1f}, MAPE = {mape:.2%}")`,
        question: "为什么要 shift(1) 才能当作预测值？不 shift 会产生什么问题？",
      },
    ],
  },

  {
    id: "p6",
    title: "电影评分数据相关性分析",
    category: "相关性 · 推荐基础",
    difficulty: "入门",
    summary:
      "基于 MovieLens 数据，探索「用户 × 电影 × 评分」矩阵。计算评分与电影年份、时长、流派等特征的相关系数，并考察不同用户群在评分偏好上的差异，为后续推荐系统提供数据基础。",
    datasetUrl: "https://grouplens.org/datasets/movielens/",
    datasetDesc: "MovieLens Latest Small（10 万评分，600+ 用户，9000+ 电影）",
    techTags: ["corr", "pivot_table", "相关系数矩阵", "用户画像"],
    objective: [
      "掌握 .corr() 与 .corrwith() 的用法",
      "能解读 Pearson 相关系数的大小与正负",
      "理解「评分稀疏矩阵」的概念",
      "能做「用户 × 流派平均分」的二维画像",
    ],
    steps: [
      {
        id: "p6s1",
        title: "合并评分 / 电影 / 流派",
        description:
          "MovieLens 的电影流派字段是竖线分隔的字符串（如 Adventure|Children|Fantasy）。先把它展开成多列 one-hot，便于后续按流派聚合。",
        codeHint: `ratings = pd.read_csv("ratings.csv")
movies = pd.read_csv("movies.csv")

# 流派展开为 0/1 列
genres = movies["genres"].str.get_dummies(sep="|")
movies_wide = pd.concat([movies.drop(columns=["genres"]), genres], axis=1)
df = ratings.merge(movies_wide, on="movieId")`,
        question: "str.get_dummies 与 sklearn 的 OneHotEncoder 有什么异同？",
      },
      {
        id: "p6s2",
        title: "简单探索：高分电影长什么样？",
        description:
          "计算每部电影的平均评分、评分人数，考察评分人数与平均分的关系——通常评分人数少的电影平均分波动极大（「小众高分」现象）。",
        codeHint: `movie_stats = (
    df.groupby("movieId", as_index=False)
    .agg(title=("title", "first"), avg_rating=("rating", "mean"), n_ratings=("rating", "count"))
    .sort_values("avg_rating", ascending=False)
)
print(movie_stats[movie_stats["n_ratings"] >= 30].head(10))`,
        question: "为什么只看平均分可能误判？实际业务中你会如何定义「好电影」？",
      },
      {
        id: "p6s3",
        title: "计算流派与评分的相关系数",
        description:
          "对流派 one-hot 列和 rating 列做 corrwith，得到「某流派出现与否」和评分的相关系数。正相关表示该流派评分偏高，负相关表示偏低。",
        codeHint: `genre_cols = genres.columns.tolist()
corr_with_rating = df[genre_cols + ["rating"]].corrwith(df["rating"]).sort_values(ascending=False)
print(corr_with_rating.round(3).head(8))
print(corr_with_rating.round(3).tail(5))`,
        question: "Film-Noir 通常与评分正相关，但评分人数却很少。这意味着什么？",
      },
      {
        id: "p6s4",
        title: "用户画像：按流派计算用户的偏好",
        description:
          "对每位用户，计算他在各个流派上的平均评分。这是一个非常朴素的「用户兴趣画像」，可以作为推荐系统的特征之一。",
        codeHint: `user_profile = pd.DataFrame()
for g in genre_cols[:8]:  # 只看前 8 个流派做演示
    user_profile[g] = df.groupby("userId").apply(
        lambda s: (s["rating"] * s[g]).sum() / (s[g].sum() + 1e-9),
        include_groups=False,
    )
# 更简洁写法：用 pivot_table + 列加权
print(user_profile.head())`,
        question: "为什么用「加权平均」而不是直接对用户看过的流派打分？",
      },
      {
        id: "p6s5",
        title: "找相似用户（余弦相似度直觉）",
        description:
          "取出两位用户的流派评分向量，计算他们的「相似度」。这一步用纯 pandas 完成，可以让你理解协同过滤背后的数学直觉。",
        codeHint: `import numpy as np

u1 = user_profile.loc[1].values.astype(float)
u2 = user_profile.loc[2].values.astype(float)
cos = np.dot(u1, u2) / (np.linalg.norm(u1) * np.linalg.norm(u2) + 1e-9)
print(f"用户 1 vs 用户 2 的余弦相似度 = {cos:.3f}")`,
        question: "如果两位用户都只看过 1 部相同电影，余弦相似度可靠吗？做相似度时你会加什么限制？",
      },
    ],
  },

  {
    id: "p7",
    title: "泰坦尼克生存数据特征工程",
    category: "特征工程 · 数据预处理",
    difficulty: "进阶",
    summary:
      "泰坦尼克数据集是 Kaggle 的「Hello World」：数据脏、字段类型混杂、有大量可用特征派生空间。通过它你能完整走一遍「缺失值填充 → 文本字段解析 → 特征派生 → 相关性筛选」的流程。",
    datasetUrl: "https://www.kaggle.com/c/titanic/data",
    datasetDesc: "Kaggle · Titanic（训练集约 891 行，含 Survived 标签）",
    techTags: ["缺失值", "特征派生", "map/extract", "相关性筛选"],
    objective: [
      "能从姓名字段中提取 Title（Mr/Mrs/Miss/Master…）",
      "能从 Cabin 字段提取甲板/是否缺失",
      "能以「分组中位数」填充缺失年龄",
      "能做相关性筛选与特征热力图准备",
    ],
    steps: [
      {
        id: "p7s1",
        title: "观察数据全貌",
        description:
          "一眼望去：PassengerId 是索引、Survived 是标签、Pclass/Sex/Age/SibSp/Parch/Fare/Embarked 等构成特征。Age、Cabin、Embarked 三列有缺失。",
        codeHint: `titanic = pd.read_csv("train.csv")
print(titanic.isnull().sum())
print(titanic.sample(5, random_state=42))`,
        question: "Cabin 字段缺失率超过 70%，你会怎么利用它而不是直接丢掉？",
      },
      {
        id: "p7s2",
        title: "从 Name 提取 Title",
        description:
          "姓名形如「Braund, Mr. Owen Harris」。用正则提取逗号后的、点号前的单词，即为称谓。称谓能强烈反映年龄/身份/社会地位。",
        codeHint: `titanic["Title"] = titanic["Name"].str.extract(r" ([A-Za-z]+)\.", expand=False)
titanic["Title"] = titanic["Title"].replace(
    ["Lady", "Countess", "Capt", "Col", "Don", "Dr", "Major", "Rev", "Sir", "Jonkheer"],
    "Rare"
)
print(titanic["Title"].value_counts())`,
        question: "为什么把一些稀有称谓归为一类而不是原样保留？",
      },
      {
        id: "p7s3",
        title: "用 Title + Pclass 分组填充 Age",
        description:
          "直接用全体均值填充年龄过于粗糙。更合理的做法是：按 Title + Pclass 分组，用各组中位数填充缺失年龄。这样更接近真实分布。",
        codeHint: `age_median = titanic.groupby(["Title", "Pclass"])["Age"].transform("median")
titanic["Age"] = titanic["Age"].fillna(age_median)

# 兜底：仍有缺失时用整体中位数
titanic["Age"] = titanic["Age"].fillna(titanic["Age"].median())`,
        question: "groupby + transform('median') 和 groupby + agg/merge 两种写法各有什么优劣？",
      },
      {
        id: "p7s4",
        title: "Cabin → Deck & 「是否记录船舱」",
        description:
          "Cabin 形如 C85，首字母即 Deck（甲板）。大量缺失其实可能表示「未记录」—本身就是一种信息。我们保留两个特征：是否有船舱记录、以及所属甲板。",
        codeHint: `titanic["has_cabin"] = titanic["Cabin"].notna().astype(int)
titanic["Deck"] = titanic["Cabin"].str[0].fillna("U")  # U = Unknown
print(titanic.groupby("Deck")["Survived"].mean().sort_values(ascending=False).round(3))`,
        question: "从各甲板的生存率差异上，你能猜想到什么现实原因？",
      },
      {
        id: "p7s5",
        title: "创建家庭规模与是否独自出行",
        description:
          "SibSp（同乘的兄弟姐妹/配偶数）+ Parch（同乘的父母/子女数）= 家庭规模。它与生存率有关：太小/太大都可能更危险。",
        codeHint: `titanic["FamilySize"] = titanic["SibSp"] + titanic["Parch"] + 1
titanic["is_alone"] = (titanic["FamilySize"] == 1).astype(int)
print(titanic.groupby("FamilySize")["Survived"].mean().round(3))`,
        question: "如果把 FamilySize 直接当作数值特征，模型会怎么理解它？有没有更好的特征化方式？",
      },
      {
        id: "p7s6",
        title: "最终数据集与相关性筛选",
        description:
          "对性别、Embarked、Deck 做 one-hot 或 label 编码，查看各特征与 Survived 的相关系数，挑选 top 特征进入模型。",
        codeHint: `features = pd.get_dummies(
    titanic[["Pclass", "Sex", "Age", "Fare", "Title", "has_cabin", "FamilySize", "is_alone", "Embarked"]],
    drop_first=True,
)
print(features.corrwith(pd.Series(titanic["Survived"], name="Survived")).sort_values(key=lambda s: s.abs(), ascending=False).round(3))`,
        question: "为什么相关性筛选只是第一步，不能完全替代模型选择特征？",
      },
    ],
  },

  {
    id: "p8",
    title: "订单数据 A/B 测试分析",
    category: "A/B Test · 假设检验",
    difficulty: "进阶",
    summary:
      "假设我们对某电商网站的「结算页」做了一次改版（B 组），与旧版（A 组）各跑了 2 周。你会用 pandas 输出：整体转化率差异、分设备的差异、统计显著性，最终给出「是否上线」的数据驱动结论。",
    datasetUrl: "https://www.kaggle.com/datasets/zhangliao/ab-testing",
    datasetDesc: "Kaggle · A/B Testing（两组成对的曝光/转化数据）",
    techTags: ["转化率", "p-value", "卡方 / t 检验直觉", "分切片分析"],
    objective: [
      "会计算曝光/点击/转化指标及差异",
      "能以分切片（设备、新老客）看差异",
      "理解「统计显著」与「业务显著」的区别",
      "能写出一份「改版上线与否」的建议报告",
    ],
    steps: [
      {
        id: "p8s1",
        title: "读取数据并计算总体转化率",
        description:
          "ab_test 表含 user_id / group / device / exposed / converted。先算两组的总体转化率，得到「直觉差异」。",
        codeHint: `ab = pd.read_csv("ab_test.csv")
summary = (
    ab.groupby("group")
    .agg(users=("user_id", "count"), converted=("converted", "sum"))
    .assign(conv_rate=lambda d: d["converted"] / d["users"])
)
print(summary.round(4))`,
        question: "如果实验组比对照组转化率高 20%，你是否会立刻判定实验组更好？为什么？",
      },
      {
        id: "p8s2",
        title: "按设备切片看差异",
        description:
          "总体提升可能被某一设备驱动。按设备分组再次计算转化率，判断是否存在「设备 × 实验」的交互效应。",
        codeHint: `by_device = (
    ab.groupby(["group", "device"])
    .agg(users=("user_id", "count"), converted=("converted", "sum"))
    .assign(conv_rate=lambda d: d["converted"] / d["users"])
    .reset_index()
)
print(by_device.pivot(index="device", columns="group", values="conv_rate").round(4))`,
        question: "什么时候会出现「总体为正，某切片为负」的辛普森悖论？如何防范误判？",
      },
      {
        id: "p8s3",
        title: "显著性检验（卡方 / 正态近似）",
        description:
          "用一个 2×2 列联表（曝光/转化 × 两组）做卡方检验，得到 p-value。约定 α=0.05，若 p<0.05 则视为统计显著。",
        codeHint: `from scipy.stats import chi2_contingency

table = [
    [summary.loc["control", "users"] - summary.loc["control", "converted"], summary.loc["control", "converted"]],
    [summary.loc["treatment", "users"] - summary.loc["treatment", "converted"], summary.loc["treatment", "converted"]],
]
chi2, p, dof, expected = chi2_contingency(table)
print(f"chi2 = {chi2:.3f}, p-value = {p:.4f}")`,
        question: "p 值很小代表什么？它能告诉我们「提升幅度有多大」吗？",
      },
      {
        id: "p8s4",
        title: "效应量与置信区间",
        description:
          "计算两组转化率的差值，并用正态近似给出 95% 置信区间。「业务意义的提升」需要看置信区间的下限是否高于 0。",
        codeHint: `import math

p_c = summary.loc["control", "conv_rate"]
p_t = summary.loc["treatment", "conv_rate"]
n_c = summary.loc["control", "users"]
n_t = summary.loc["treatment", "users"]

delta = p_t - p_c
se = math.sqrt(p_c * (1 - p_c) / n_c + p_t * (1 - p_t) / n_t)
ci = (delta - 1.96 * se, delta + 1.96 * se)
print(f"提升 = {delta:.2%}, 95% CI = [{ci[0]:.2%}, {ci[1]:.2%}]")`,
        question: "如果 95% 置信区间跨过 0，你的结论是什么？如果完全为正呢？",
      },
      {
        id: "p8s5",
        title: "输出上线建议",
        description:
          "综合：总体显著性、设备切片是否一致、置信区间下限是否高于业务可接受的最低提升。给出 3 段式结论：是否上线 + 注意事项 + 后续跟进指标。",
        codeHint: `# 文字报告示例（请根据你的数据写出）：
# 1) 总体：实验组转化率 = x%，对照组 = y%，提升 = z%（p < 0.05）
# 2) 分设备：移动端提升显著，PC 端无显著差异
# 3) 建议：在移动端上线 B 版；PC 端保持 A 版并继续收集数据`,
        question: "如果实验组「统计显著」，但提升幅度只有 0.2%，你会建议上线吗？为什么？",
      },
    ],
  },

  {
    id: "p9",
    title: "商品评论情感基础统计（词频视角）",
    category: "文本分析 · 情感基础",
    difficulty: "入门",
    summary:
      "不引入任何复杂 NLP 模型，仅用 pandas 做文本切分、停用词去除、词频统计，结合手工情感词典，输出一份「正负评论高频词对比报告」。这是理解文本数据的第一步。",
    datasetUrl: "https://www.kaggle.com/datasets/snap/amazon-fine-food-reviews",
    datasetDesc: "Kaggle · Amazon Fine Food Reviews（50 万条食品评论 + 评分）",
    techTags: ["str.lower / split", "停用词", "value_counts", "词频对比"],
    objective: [
      "会用 pandas 字符串方法做基础文本处理",
      "能构建/使用停用词表并过滤无意义词",
      "能对「好评/差评」做词频对比",
      "能识别词频中暴露的产品问题关键词",
    ],
    steps: [
      {
        id: "p9s1",
        title: "读取并打标签：好评 / 差评",
        description:
          "用评分近似标签：Score=5 视为好评，Score ≤ 2 视为差评。忽略中性评论，能让我们专注于最明显的情感差异。",
        codeHint: `reviews = pd.read_csv("Reviews.csv", usecols=["Score", "Text"])
reviews["label"] = reviews["Score"].map({5: "pos", 1: "neg", 2: "neg"}).fillna("neu")
pos = reviews[reviews["label"] == "pos"]["Text"]
neg = reviews[reviews["label"] == "neg"]["Text"]
print(len(pos), len(neg))`,
        question: "用评分替代标签有什么风险？你会如何验证「评分 ≈ 情感」的假设？",
      },
      {
        id: "p9s2",
        title: "清洗 + 分词",
        description:
          "统一小写、去除标点/数字，再按空白切分。这是非常朴素的分词，但足以做词频统计的第一版。",
        codeHint: `import re

def tokenize(s: str) -> list[str]:
    s = s.lower()
    s = re.sub(r"[^a-z\\s]", " ", s)
    return [w for w in s.split() if len(w) > 2]

pos_words = pos.apply(tokenize).explode()
neg_words = neg.apply(tokenize).explode()`,
        question: "为什么通常要把词长度过滤为 > 2？这会丢失什么信息？",
      },
      {
        id: "p9s3",
        title: "停用词过滤",
        description:
          "英文常见停用词（the/and/of/...）对词频图干扰很大。使用一个简单的停用词集合过滤，剩下的词会更「有味道」。",
        codeHint: `STOPWORDS = {
    "the","and","for","that","this","with","was","are","but","you","not","they",
    "have","had","has","will","just","can","been","from","were","also","their",
    "your","there","them","then","than","been","because","these","being","into",
}
pos_words = pos_words[~pos_words.isin(STOPWORDS)]
neg_words = neg_words[~neg_words.isin(STOPWORDS)]

print("TOP 10 POS:")
print(pos_words.value_counts().head(10))
print("\\nTOP 10 NEG:")
print(neg_words.value_counts().head(10))`,
        question: "如果不做停用词过滤，TOP 词一般会是什么？这对分析有什么影响？",
      },
      {
        id: "p9s4",
        title: "构建「差评独有高频词」排行",
        description:
          "用相对比例找问题关键词：在差评中出现比例远高于好评的词，往往指向产品的真实问题（如 bitter / expire / broken / refund）。",
        codeHint: `pos_top = pos_words.value_counts(normalize=True).to_frame("p_pos")
neg_top = neg_words.value_counts(normalize=True).to_frame("p_neg")
diff = neg_top.join(pos_top, how="outer").fillna(0)
diff["neg_ratio"] = diff["p_neg"] / (diff["p_pos"] + 1e-6)
print(diff[diff["p_neg"] > 0.002].sort_values("neg_ratio", ascending=False).head(15))`,
        question: "为什么用「比例」比「绝对次数」更好？",
      },
      {
        id: "p9s5",
        title: "输出一句业务结论",
        description:
            "结合词频与差评独有词，给出一句话洞察：例如「消费者对口感（taste/flavor）总体满意，但对保质期（expire）和包装（package）抱怨集中。」",
        codeHint: `# 你的结论：把它写在 Notebook 的最后，作为给业务方的核心发现。`,
        question: "如果让你用一个指标衡量「本次词频分析的业务价值」，你会选什么？",
      },
    ],
  },

  {
    id: "p10",
    title: "综合案例：共享单车需求洞察",
    category: "综合分析 · 聚类 · 业务解读",
    difficulty: "综合",
    summary:
      "融合前 9 个项目的核心技能：清洗 + 聚合 + 时序 + 聚类 + 分切片报告。以 Capital Bikeshare 数据为底，输出一份可以直接给城市交通团队的「用户行为 × 需求画像」综合报告。",
    datasetUrl: "https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset",
    datasetDesc: "UCI · Bike Sharing（日/小时两个粒度，含天气/季节/注册用户/临时用户）",
    techTags: ["综合", "时序聚合", "hour 画像", "天气相关性", "KMeans"],
    objective: [
      "综合使用清洗/聚合/时序/聚类等方法",
      "能产出一份包含图表 + 业务建议的完整分析报告",
      "能把图表「翻译」为业务同学听得懂的语言",
    ],
    steps: [
      {
        id: "p10s1",
        title: "数据体检与清洗",
        description:
          "先做 info/describe/isnull 三板斧，随后对 dteday 做日期类型矫正，确认 season / yr / mnth / hr 等分类字段类型是否合理。",
        codeHint: `hour = pd.read_csv("hour.csv")
hour["dteday"] = pd.to_datetime(hour["dteday"])

# 做一次缺失/异常检查
print(hour.isnull().sum())
print(hour.describe().T)`,
        question: "hum（湿度）、windspeed（风速）、temp（温度）、cnt（总租车数）如果出现异常值，你会如何发现？",
      },
      {
        id: "p10s2",
        title: "按小时聚合：绘制「一天中的需求曲线」",
        description:
          "计算各小时的平均租车数，按工作日/周末分别画出两条曲线。你会看到明显的早晚高峰（通勤）与周末的平滑曲线（休闲）。",
        codeHint: `by_hr = (
    hour.groupby(["hr", "workingday"])["cnt"].mean().reset_index()
    .pivot(index="hr", columns="workingday", values="cnt")
)
by_hr.columns = ["非工作日", "工作日"]
print(by_hr.round(1))`,
        question: "从两条曲线差异上，你会给出什么车辆调度建议？",
      },
      {
        id: "p10s3",
        title: "天气对需求的影响",
        description:
          "按 weathersit（天气类型）看平均需求，并结合温度/湿度做相关系数分析。天气是共享单车最大的外部因素之一。",
        codeHint: `by_w = (
    hour.groupby("weathersit")
    .agg(n=("cnt", "count"), avg_cnt=("cnt", "mean"))
    .sort_values("avg_cnt", ascending=False)
)
print(by_w.round(1))
print("\\n与天气字段的相关性：")
print(hour[["temp", "atemp", "hum", "windspeed", "cnt"]].corr()["cnt"].sort_values(ascending=False).round(3))`,
        question: "温度与需求呈正相关，但极端高温时需求会下降。你会如何用一个特征捕捉这种「倒 U」关系？",
      },
      {
        id: "p10s4",
        title: "用户聚类：按小时使用模式识别用户画像",
        description:
            "构造「24 维平均租车数」向量（按日期聚合得到每天的 24 小时向量），对天做 KMeans 聚类，观察不同天气/季节的模式差异。",
        codeHint: `pivot = hour.pivot_table(index=["dteday", "workingday"], columns="hr", values="cnt", aggfunc="mean").fillna(0)
pivot = pivot.reset_index()

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(pivot.iloc[:, 2:])
pivot["day_type"] = KMeans(n_clusters=4, random_state=42, n_init=10).fit_predict(X)

# 看不同 day_type 下工作日比例、平均需求曲线
print(pivot.groupby("day_type")["workingday"].mean().round(2))`,
        question: "聚类得到的 day_type 0/1/2/3 本身没有意义，你会如何给它们命名？",
      },
      {
        id: "p10s5",
        title: "输出综合报告",
        description:
          "完成一份 3 段式报告：① 关键发现（需求高峰、天气影响）；② 用户/日期画像（聚类命名）；③ 运营建议（调度、天气预警、季节促销）。",
        codeHint: `# 综合报告要点：
# - 工作日：早 8 点、晚 5-7 点双高峰；建议调度集中在早晚高峰前后 30 分钟
# - 周末：午后持续高位；建议在景区/公园点提前布车
# - 天气：雨天需求下降 30%+，可减少调度 + 提前维护
# - 用户：注册用户明显承担通勤角色，临时用户承担旅游角色`,
        question: "如果你是城市交通团队负责人，拿到这份报告后，下周会做哪 3 件事？",
      },
    ],
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
