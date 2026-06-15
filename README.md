<!-- Git 仓库：git@github.com:rick-peng-li/factoryflow-ment-web.git -->

# FactoryFlow Ment Web

## 项目简介
FactoryFlow Ment Web 是一个面向工厂生产协同场景的任务协作系统，采用前后端分离架构实现。系统围绕生产任务创建、状态推进、进度监控、日程排期、人员负载分析等核心场景设计，适用于生产排程、车间任务跟进、班组协作和流程透明化管理。

项目当前包含以下核心业务视图：
- Dashboard：汇总工厂运行态势、近期任务、到期风险和团队负载
- Task Center：集中搜索、筛选、快捷更新和列表化管理任务
- Kanban：用状态看板推进任务流转
- Schedule：按时间维度查看 7 天排期、逾期任务和未排期任务
- Team：按负责人查看负载、完成情况和高优先级任务分布

## 核心功能
- 用户注册、登录、退出登录
- JWT 鉴权与受保护路由访问控制
- Dashboard 首页展示任务统计、完成率、近期动态、即将到期任务和团队快照
- Task Center 支持任务搜索、状态筛选、优先级筛选和快捷状态变更
- Kanban 看板按 Pending、In Progress、Completed 三列管理任务
- Schedule 页面支持 7 天时间线、今日到期、逾期任务和未排期任务视图
- Team 页面支持负责人工作量对比、负载分布和任务明细查看
- 支持新增、编辑、删除任务
- 支持任务优先级、负责人、截止日期等业务字段

## 技术架构
### 前端
- React 19
- Vite 8
- React Router 7
- Axios
- Tailwind CSS 4
- Context API（AuthContext、TaskContext）

### 后端
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT
- bcryptjs
- dotenv
- cors

### 架构说明
```text
client
  ├─ pages            页面层
  ├─ components       组件层
  ├─ context          状态管理层
  └─ services         接口访问层

server
  ├─ routes           路由层
  ├─ controllers      业务控制层
  ├─ models           数据模型层
  ├─ middleware       中间件层
  └─ config           基础配置层
```

## 目录结构
```text
factoryflow-ment-web/
├─ client/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ Layout.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ ProtectedRoute.jsx
│  │  │  ├─ StatCard.jsx
│  │  │  ├─ TaskCard.jsx
│  │  │  └─ TaskModal.jsx
│  │  ├─ context/
│  │  │  ├─ AuthContext.jsx
│  │  │  └─ TaskContext.jsx
│  │  ├─ pages/
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ Tasks.jsx
│  │  │  ├─ Kanban.jsx
│  │  │  ├─ Schedule.jsx
│  │  │  ├─ Team.jsx
│  │  │  ├─ Login.jsx
│  │  │  └─ Register.jsx
│  │  ├─ services/
│  │  │  └─ api.js
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ package.json
│  └─ vite.config.js
├─ server/
│  ├─ config/db.js
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ index.js
│  └─ package.json
└─ README.md
```

## 前端模块与页面设计
### 路由设计
| 路径 | 页面 | 访问控制 | 功能说明 |
| --- | --- | --- | --- |
| /login | 登录页 | 公开 | 用户输入邮箱和密码后登录系统 |
| /register | 注册页 | 公开 | 创建账号并选择角色 |
| /dashboard | 仪表盘 | 需登录 | 展示统计、近期任务、即将到期任务、团队快照和功能入口 |
| /tasks | 任务中心 | 需登录 | 提供搜索、筛选、列表管理和快捷状态更新 |
| /kanban | 看板页 | 需登录 | 以三列状态看板形式维护任务 |
| /schedule | 排期页 | 需登录 | 查看 7 天排期、逾期任务、今日到期任务和未排期任务 |
| /team | 团队页 | 需登录 | 查看负责人负载、任务分布和团队执行情况 |
| / | 默认路由 | 需登录 | 自动重定向到 /dashboard |

### 页面说明
#### 1. 登录页 Login
- 提供邮箱和密码输入
- 调用登录接口后保存用户信息与 token 到 localStorage
- 登录成功后跳转到 Dashboard

#### 2. 注册页 Register
- 支持填写姓名、邮箱、密码、角色
- 调用注册接口后自动登录并进入 Dashboard

#### 3. 仪表盘 Dashboard
- 展示任务总量、待处理、进行中、已完成四类统计
- 展示近期任务列表
- 展示整体完成率与逾期数量
- 展示即将到期任务与团队负载快照
- 提供 Task Center、Kanban、Schedule、Team 四个快速入口

#### 4. 任务中心 Tasks
- 支持按标题、描述、负责人搜索任务
- 支持按状态和优先级筛选任务
- 支持查看过滤后的逾期数、即将到期数、未分配数
- 支持在列表中直接把任务切换到 Pending、In Progress、Completed
- 支持编辑和删除任务

#### 5. 看板页 Kanban
- 按任务状态分为 Pending、In Progress、Completed 三列
- 支持打开弹窗创建任务
- 支持编辑任务、删除任务、切换任务状态
- 适合生产任务的可视化推进与跟踪

#### 6. 排期页 Schedule
- 展示 7 天时间线，按日期查看任务分布
- 聚合逾期任务、今日到期任务、未来 7 天任务数量
- 提供未排期任务列表，便于补充排程
- 适合生产节拍、周计划和风险任务跟踪

#### 7. 团队页 Team
- 按负责人聚合任务量、进行中数量、待处理数量、高优先级数量
- 支持点击成员查看该成员的任务明细
- 支持查看未分配任务和团队整体完成率
- 适合班组长或管理者做人员负载平衡

### 前端核心模块
| 模块 | 文件 | 作用 |
| --- | --- | --- |
| 路由入口 | client/src/App.jsx | 统一注册页面路由并接入鉴权保护 |
| 认证状态 | client/src/context/AuthContext.jsx | 管理用户信息、登录、注册、退出 |
| 任务状态 | client/src/context/TaskContext.jsx | 管理任务列表、统计数据和增删改查 |
| 路由守卫 | client/src/components/ProtectedRoute.jsx | 未登录用户禁止访问业务页面 |
| 布局容器 | client/src/components/Layout.jsx | 统一页面框架与内容容器 |
| 顶部导航 | client/src/components/Navbar.jsx | 管理多页面导航、用户信息和退出登录 |
| 统计卡片 | client/src/components/StatCard.jsx | 展示各页面的汇总指标卡片 |
| 任务卡片 | client/src/components/TaskCard.jsx | 展示看板任务摘要并支持快捷操作 |
| 任务弹窗 | client/src/components/TaskModal.jsx | 统一处理创建和编辑任务 |
| 接口封装 | client/src/services/api.js | Axios 实例与 token 请求头注入 |

## 后端模块与接口设计
### 模块职责
| 模块 | 文件/目录 | 功能说明 |
| --- | --- | --- |
| 服务入口 | server/index.js | 初始化 Express、中间件、数据库连接和路由 |
| 数据库配置 | server/config/db.js | 连接 MongoDB，并设置 DNS 解析 |
| 鉴权中间件 | server/middleware/authMiddleware.js | 解析 Bearer Token，校验并挂载当前用户 |
| 用户控制器 | server/controllers/authController.js | 注册、登录、获取当前用户 |
| 任务控制器 | server/controllers/taskController.js | 查询、创建、更新、删除任务 |
| 用户模型 | server/models/User.js | 用户结构、密码加密、密码比对 |
| 任务模型 | server/models/Task.js | 任务字段定义与时间戳管理 |

### 数据模型设计
#### User
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| name | String | 用户姓名 |
| email | String | 唯一邮箱，小写存储 |
| password | String | 密码，保存前进行 bcrypt 加密 |
| role | String | 角色，支持 admin / employee |
| createdAt / updatedAt | Date | 系统自动维护 |

#### Task
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| title | String | 任务标题，必填 |
| description | String | 任务描述 |
| status | String | 状态，支持 Pending / In Progress / Completed |
| priority | String | 优先级，支持 Low / Medium / High |
| assignedTo | String | 指派人 |
| dueDate | Date | 截止时间 |
| createdBy | ObjectId | 创建人用户 ID |
| createdAt / updatedAt | Date | 系统自动维护 |

### API 设计
基础前缀：`/api`

#### 认证接口
| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| POST | /api/auth/register | 否 | 注册账号并返回用户信息与 token |
| POST | /api/auth/login | 否 | 登录并返回用户信息与 token |
| GET | /api/auth/me | 是 | 获取当前登录用户信息 |

#### 任务接口
| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| GET | /api/tasks | 是 | 获取任务列表，按创建时间倒序返回 |
| POST | /api/tasks | 是 | 创建任务 |
| PUT | /api/tasks/:id | 是 | 更新指定任务 |
| DELETE | /api/tasks/:id | 是 | 删除指定任务 |

### 典型请求参数
#### 注册
```json
{
  "name": "张三",
  "email": "zhangsan@factory.com",
  "password": "123456",
  "role": "employee"
}
```

#### 登录
```json
{
  "email": "zhangsan@factory.com",
  "password": "123456"
}
```

#### 创建任务
```json
{
  "title": "焊接 A 区支架",
  "description": "优先完成一号产线的支架焊接",
  "status": "Pending",
  "priority": "High",
  "assignedTo": "李四",
  "dueDate": "2026-06-20"
}
```

### 返回数据说明
#### 登录/注册成功
```json
{
  "_id": "userId",
  "name": "张三",
  "email": "zhangsan@factory.com",
  "role": "employee",
  "token": "jwt-token"
}
```

#### 任务对象
```json
{
  "_id": "taskId",
  "title": "焊接 A 区支架",
  "description": "优先完成一号产线的支架焊接",
  "status": "Pending",
  "priority": "High",
  "assignedTo": "李四",
  "dueDate": "2026-06-20T00:00:00.000Z",
  "createdBy": "userId",
  "createdAt": "2026-06-15T12:00:00.000Z",
  "updatedAt": "2026-06-15T12:00:00.000Z"
}
```

## 认证与权限机制
- 前端将登录成功后的用户对象和 JWT token 存入 localStorage
- Axios 请求拦截器会自动为请求附带 `Authorization: Bearer <token>`
- 后端通过 `authMiddleware` 校验 token，并在 `req.user` 上注入用户信息
- `ProtectedRoute` 用于拦截未登录访问，保证 Dashboard、Tasks、Kanban、Schedule、Team 页面只能在登录后进入

## 启动方式
### 1. 安装依赖
分别安装前后端依赖：

```bash
cd server
npm install

cd ../client
npm install
```

### 2. 配置后端环境变量
在 `server/.env` 中至少配置以下内容：

```env
MONGO_URI=mongodb://127.0.0.1:27017/factoryflow
JWT_SECRET=replace-with-your-own-secret
PORT=5000
```

### 3. 启动后端
```bash
cd server
npm run dev
```

### 4. 启动前端
```bash
cd client
npm run dev
```

### 5. 访问系统
- 前端地址：`http://localhost:5173`
- 后端地址：`http://localhost:5000`
- 接口前缀：`http://localhost:5000/api`

## 开发说明
- 前端接口基地址在 `client/src/services/api.js` 中配置为 `http://localhost:5000/api`
- 后端 CORS 当前允许 `http://localhost:5173` 访问
- Dashboard、Task Center、Schedule、Team 页面主要基于 TaskContext 中的任务数据做前端聚合展示
- Schedule 页面使用截止日期对任务做时间分桶，适合扩展为更完整的排产日历
- Team 页面使用 assignedTo 维度做任务聚合，适合后续扩展工位、班组和产线维度分析
