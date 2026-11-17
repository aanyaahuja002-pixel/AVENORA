import puppeteer from "puppeteer-core";
import fs from "fs";

async function main() {
  console.log("Starting visual verification test...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // 1. Initial State Screenshot
  await page.screenshot({ path: "screenshot-desktop-initial.png" });
  console.log("Saved: screenshot-desktop-initial.png");

  // 2. Mid Scroll (Expanding Portal)
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.0, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: "screenshot-desktop-midscroll.png" });
  console.log("Saved: screenshot-desktop-midscroll.png");

  // 3. Deep Brand Reveal (Full Viewport Expanded)
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.2, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: "screenshot-desktop-revealed.png" });
  console.log("Saved: screenshot-desktop-revealed.png");

  // 4. Sanctuary switch test: click on 02 Kanso
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const kansoBtn = buttons.find((b) => b.textContent?.includes("Kanso"));
    if (kansoBtn) {
      kansoBtn.click();
      return true;
    }
    return false;
  });
  console.log("Clicked Kanso button:", clicked);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: "screenshot-desktop-kanso.png" });
  console.log("Saved: screenshot-desktop-kanso.png");

  // 5. Mobile Viewport (390 x 844)
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: "screenshot-mobile-refined.png" });
  console.log("Saved: screenshot-mobile-refined.png");

  await browser.close();
  console.log("Verification finished. Console errors logged:", errors.length);
  if (errors.length > 0) {
    console.error("Console errors encountered:", errors);
  }
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
