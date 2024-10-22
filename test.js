const { Telegraf } = require("telegraf");
const fetch = require("node-fetch"); // 用于请求 API

// Telegram Bot Token
const BOT_TOKEN = "7703677941:AAGN1vo8U1UCJt90VQO3kzfwJUnEsJtEk8E";
const bot = new Telegraf(BOT_TOKEN);

let currentSymbols = new Set();

// 从线上 API 获取交易对数据
async function getLatestSymbols() {
  const url = "https://api.mexc.com/api/v3/defaultSymbols";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return new Set(data.data); // 提取 'data' 字段中的交易对
  } catch (error) {
    console.error("请求失败:", error);
    return new Set();
  }
}

// 定期检查是否有新的交易对上线
async function checkNewSymbols() {
  const newSymbols = await getLatestSymbols();

  if (newSymbols.size > 0) {
    const newListings = [...newSymbols].filter(
      (symbol) => !currentSymbols.has(symbol)
    );

    if (newListings.length > 0) {
      const message = `新的交易对上线了: ${newListings.join(", ")}`;
      // 使用bot.telegram.sendMessage发送消息，而不是ctx.reply
      bot.telegram.sendMessage("1128368090", message); // 替换 '1128368090' 为你和机器人的对话ID
      console.log("发送消息:", message);
    }

    currentSymbols = newSymbols;
  }
}

// 启动时获取初始交易对
(async () => {
  currentSymbols = await getLatestSymbols();
})();

// 处理 /start 命令
bot.start((ctx) => {
  const chatId = ctx.chat.id;
  console.log(`你的聊天ID是: ${chatId}`);
  ctx.reply("你好！我是一个监控MEXC新交易对的机器人！");
});

// 设置定时任务，每隔10秒检查一次新交易对
setInterval(() => {
  checkNewSymbols();
}, 10000); // 每隔10秒运行一次

// 启动机器人
bot.launch();
console.log("机器人已启动...");
