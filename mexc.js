const fetch = require("node-fetch");
const { Telegraf } = require("telegraf");

// 在这里替换为你的 Telegram 机器人 API Token
const BOT_TOKEN = "7703677941:AAGN1vo8U1UCJt90VQO3kzfwJUnEsJtEk8E";
const bot = new Telegraf(BOT_TOKEN);

let currentSymbols = new Set();

// 获取最新交易对数据
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

bot.on("text", (ctx) => {
  console.log("聊天ID:", ctx.chat.id); // 打印聊天 ID
  ctx.reply(`你的聊天ID是: ${ctx.chat.id}`);
});
// 定期检查是否有新的交易对上线
async function checkNewSymbols(ctx) {
  const newSymbols = await getLatestSymbols();

  if (newSymbols.size > 0) {
    const newListings = [...newSymbols].filter(
      (symbol) => !currentSymbols.has(symbol)
    );

    if (newListings.length > 0) {
      const message = `新的交易对上线了: ${newListings.join(", ")}`;
      await ctx.reply(message);
      console.log("发送消息:", message);
    }

    currentSymbols = newSymbols; // 更新交易对列表
  }
}

// 启动时获取初始交易对
getLatestSymbols().then((symbols) => (currentSymbols = symbols));

// 处理 /start 命令
bot.start((ctx) => ctx.reply("你好！我是一个监控MEXC新交易对的机器人！"));

// 设置定时任务，每隔 10 秒检查新交易对
setInterval(() => {
  bot.telegram
    .getUpdates()
    .then((updates) =>
      updates.forEach((update) => checkNewSymbols(bot.telegram))
    );
}, 10000);

// 启动机器人
bot.launch();
console.log("机器人已启动...");
