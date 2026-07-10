# 🧠 认知功能人格测评 — 科学化 MBTI

基于荣格 8 种认知功能模型的科学化人格评估工具。打破传统 MBTI 的二元迫选模式，用连续谱系 + 功能栈匹配提供更精准的结果。

## ✨ 特性

- **8 认知功能模型**：Se / Si / Ne / Ni / Te / Ti / Fe / Fi
- **120 道科学题库**：情境判断 (SJT) + Likert 量表 + 迫选对
- **质量保障**：注意力检测 + 一致性检验 + 社会期望偏向检测
- **功能栈匹配**：欧氏距离匹配 16 种 MBTI 类型
- **可视化报告**：雷达图 / 功能栈 / 类型排名 / 质量报告
- **暗色模式 + 移动端适配**

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Tailwind CSS v4 + Recharts + Zustand |
| 后端 | Python FastAPI + SQLAlchemy + Pydantic |
| 数据库 | SQLite (MVP) → PostgreSQL |
| 部署 | Vercel (前端) + Railway (后端) |

## 🚀 本地运行

### 后端

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

打开 http://localhost:5173

### 运行测试

```bash
cd backend
python3 tests/test_scoring.py
```

## 📦 部署

- **Vercel** (前端): 连接 `frontend/` 目录，框架选择 Vite
- **Railway** (后端): 连接 `backend/` 目录，自动检测 Python

或直接用按钮一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📊 计分算法

```
原始分 → 归一化 (0-100) → 功能栈排序 → 欧氏距离匹配 16 类型模板
                                       ↓
                            注意力检测 + 一致性检验
                                       ↓
                                  质量报告
```

## 📁 项目结构

```
mbti-cognitive/
├── backend/
│   ├── app/
│   │   ├── main.py              FastAPI 入口
│   │   ├── scoring.py           计分引擎
│   │   ├── type_templates.py    16 类型功能栈模板
│   │   ├── questions.py         题库加载
│   │   ├── models.py            SQLAlchemy 模型
│   │   ├── schemas.py           Pydantic 校验
│   │   └── routers/             API 路由
│   ├── data/questions.json      120 道题库
│   └── tests/                   单元测试
├── frontend/
│   ├── src/
│   │   ├── pages/               HomePage / TestPage / ResultPage
│   │   ├── components/          QuestionCard / RadarChart / ...
│   │   ├── store/               Zustand 状态管理
│   │   └── types/               类型定义
│   └── vercel.json              Vercel 部署配置
└── README.md
```

## 📄 License

MIT
