# DSS（COSCO SHIPPING Agentic DSS UI）
基于 Vite + React + TypeScript + Ant Design 的前端原型项目，用于复刻/实现「Agentic DSS」界面壳层，并实现「主要船东」模块的表格展示。
## 本地运行
```bash
npm install
npm run dev
```
构建与预览：
```bash
npm run build
npm run preview
```
## 主要页面
- **主要船东**：`src/pages/MajorShipowners/MajorShipownersPage.tsx`
  - 表格组件：`src/pages/MajorShipowners/MajorShipownersTable.tsx`
## 主要船东表格数据来源（Excel → JSON → 页面）
页面表格数据来自 `data/` 下四个 Excel（按文件名映射船型）：
- `data/capesize.xlsx` → 好望角型船
- `data/panamax.xlsx` → 巴拿马型船
- `data/handymax.xlsx` → 大灵便型船
- `data/handysize.xlsx` → 小灵便型船
每个 Excel 读取字段：
- `Group Company`
- `Fleet No`（自有艘数）
- `OB No`（在建艘数）
- `Avg Size`（平均载重吨，用于计算 DWT）
载重吨口径：
- **自有载重吨** \(DWT\) = `Fleet No * Avg Size`
- **在建载重吨** \(DWT\) = `OB No * Avg Size`
- **总艘数** = 自有艘数（四船型） + 在建艘数（四船型）
- **总载重吨** = 自有载重吨（四船型） + 在建载重吨（四船型）
### 1) 生成 `fleet-metrics.json`
运行脚本从 `data/*.xlsx` 抽取并生成 JSON：
```bash
node scripts/extractFleetMetrics.mjs
```
该脚本会同时写出：
- `data/fleet-metrics.json`
- `public/fleet-metrics.json`（前端运行时通过 `fetch("/fleet-metrics.json")` 读取）
脚本位置：`scripts/extractFleetMetrics.mjs`
### 2) 页面读取与展示
`MajorShipownersTable` 会读取 `public/fleet-metrics.json`，并进行：
- 船型映射（由文件名决定）
- 艘数/载重吨计算
- 汇总列计算（总艘数、总载重吨）
- 仅展示白名单船东（Top10）并按指定顺序排序
白名单与顺序定义在：`src/pages/MajorShipowners/MajorShipownersTable.tsx` 的 `visibleShipowners`。
## 目录结构（节选）
```text
data/                      # Excel 原始数据与抽取后的 JSON
public/fleet-metrics.json   # 前端读取的 JSON（由脚本生成）
scripts/extractFleetMetrics.mjs
src/pages/MajorShipowners/
```
## 常见问题
- **我更新了 xlsx，页面没变化**：
  - 先运行 `node scripts/extractFleetMetrics.mjs` 重新生成 `public/fleet-metrics.json`
  - 再重启 `npm run dev`（或强制刷新页面）
- **Excel 表头不在第一行**：
  - 脚本会自动向下扫描，找到包含 `Fleet No` 的表头行后再解析。
