const express = require("express");
const app = express();
const port = 3000;

// 模拟的交易对数据
let symbols = ["CGPTUSDT", "HEGICUSDT", "SHOOTUSDT", "BTCUSDT"];

// 定义一个API端点，返回交易对数据
app.get("/api/v3/defaultSymbols", (req, res) => {
  res.json({
    data: symbols,
    code: 0,
    msg: "success",
    timestamp: Date.now(),
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`模拟的MEXC API正在运行在 http://localhost:${port}`);
});
