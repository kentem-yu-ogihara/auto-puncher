import prompts from "prompts";
import { chromium } from "playwright";
import dotenv from "dotenv";
dotenv.config();

// 現在時刻を30分単位に丸める
function getRoundedTime() {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.floor(minutes / 30) * 30;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  const hours = String(now.getHours());
  const minutesFormatted = String(now.getMinutes());
  return { hours, minutesFormatted };
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 打刻処理
async function punch(page) {
  await page.goto("https://id.jobcan.jp/users/sign_in");
  await page.fill("#user_email", process.env.PW_USERNAME);
  await page.fill("#user_password", process.env.PW_PASSWORD);
  await page.click('input[type="submit"]');
  await page.goto("https://ssl.jobcan.jp/jbcoauth/login");
  await page.click("#adit-button-push"); // 打刻ボタンクリック
}

// 残業申請処理
async function submitOvertime(page, hours, minutesFormatted) {
  await page.goto("https://ssl.jobcan.jp/employee/over-work/new");
  await page.selectOption("select#end_h", { value: hours });
  await page.selectOption("select#end_m", { value: minutesFormatted });
  const textarea = page.getByRole("textbox");
  if (process.env.OVERTIME_REASON) await textarea.fill(process.env.OVERTIME_REASON);
  await page
    .locator('input[type="button"]')
    .filter({ hasText: "確認画面に進む" })
    .click();
  await page
    .locator('input[type="button"]')
    .filter({ hasText: "申請" })
    .click();
}

const response = await prompts({
  type: "select",
  name: "work",
  message: "打刻種別を選択してください",
  choices: [
    { title: "出勤", value: "start" },
    { title: "退勤", value: "finish" },
  ],
});

const browser = await chromium.launch({
  headless: process.env.HEADLESS_MODE === "on",
});
const page = await browser.newPage();

await punch(page);
await sleep(2000); // 打刻してから少しだけ待機（すぐ切り替えるとちょっと不安）

if (response.work === "start") console.log("今日も頑張りましょう...！");

if (response.work === "finish") {
  const { hours, minutesFormatted } = getRoundedTime();
  if (`${hours}${minutesFormatted}` === "170") {
    // 17:00 には残業入力を行えないので終了
    console.log("お疲れ様でした！🎉");
    process.exit(1);
  }
  await submitOvertime(page, hours, minutesFormatted);
  await sleep(2000);
  console.log(
    `${hours}:${minutesFormatted.padStart(2, "0")} 残業申請が完了しました！お疲れ様でした！🎉`
  );
}
process.exit(1);
