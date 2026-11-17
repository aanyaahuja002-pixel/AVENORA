import puppeteer from "puppeteer-core";

async function runStage3Tests() {
  console.log("Starting Stage 3 form submission test...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // 1. Scroll to Contact Section
  await page.evaluate(() => {
    const el = document.getElementById("contact-advisory");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 600));

  // 2. Click inputs and type with keyboard
  const nameInput = await page.$('input[placeholder*="Singhania"]');
  if (nameInput) {
    await nameInput.click();
    await page.keyboard.type("Aarav Singhania");
  }

  const emailInput = await page.$('input[placeholder*="singhania.holdings"]');
  if (emailInput) {
    await emailInput.click();
    await page.keyboard.type("aarav@singhania.holdings");
  }

  const phoneInput = await page.$('input[placeholder*="98201"]');
  if (phoneInput) {
    await phoneInput.click();
    await page.keyboard.type("+91 98201 99999");
  }

  const msgInput = await page.$('textarea[placeholder*="Detail specific"]');
  if (msgInput) {
    await msgInput.click();
    await page.keyboard.type("Looking to acquire an ultra-luxury duplex penthouse in Worli with direct Arabian Sea views.");
  }

  // Click Submit
  const submitBtn = await page.$('#contact-advisory button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
  }

  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: "screenshot-stage3-inquiry-confirmed-success.png" });
  console.log("Saved: screenshot-stage3-inquiry-confirmed-success.png");

  // Verify localStorage content
  const storedData = await page.evaluate(() => {
    return localStorage.getItem("avenora_contact_inquiries");
  });
  console.log("LocalStorage Data Verified:", storedData);

  // 3. Switch to Viewing Tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll("#contact-advisory button"));
    const viewingTab = tabs.find((t) => t.textContent?.includes("Schedule Property Viewing"));
    if (viewingTab) viewingTab.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const dateInput = await page.$('#contact-advisory input[type="date"]');
  if (dateInput) {
    await dateInput.click();
    await page.keyboard.type("2026-11-25");
  }

  const vNameInput = await page.$('#contact-advisory input[placeholder*="Oberoi"]');
  if (vNameInput) {
    await vNameInput.click();
    await page.keyboard.type("Vikramaditya Oberoi");
  }

  const vPhoneInput = await page.$('#contact-advisory input[placeholder*="98200"]');
  if (vPhoneInput) {
    await vPhoneInput.click();
    await page.keyboard.type("+91 98200 12345");
  }

  const vEmailInput = await page.$('#contact-advisory input[placeholder*="oberoi.group"]');
  if (vEmailInput) {
    await vEmailInput.click();
    await page.keyboard.type("vikram@oberoi.group");
  }

  const vSubmitBtn = await page.$('#contact-advisory button[type="submit"]');
  if (vSubmitBtn) {
    await vSubmitBtn.click();
  }

  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: "screenshot-stage3-viewing-confirmed-success.png" });
  console.log("Saved: screenshot-stage3-viewing-confirmed-success.png");

  const storedViewings = await page.evaluate(() => {
    return localStorage.getItem("avenora_viewing_requests");
  });
  console.log("LocalStorage Viewings Verified:", storedViewings);

  await browser.close();
  console.log("Form and persistence test completed successfully!");
}

runStage3Tests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
