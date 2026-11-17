import puppeteer from "puppeteer-core";

async function runTest() {
  console.log("Starting enhanced Section 2 visual verification...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // 1. Scroll directly to property cards grid in Section 2
  await page.evaluate(() => {
    const el = document.getElementById("property-discovery");
    if (el) {
      el.scrollIntoView({ behavior: "instant" });
      window.scrollBy({ top: 380, behavior: "instant" });
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({ path: "screenshot-section2-cards-grid.png" });
  console.log("Saved: screenshot-section2-cards-grid.png");

  // 2. Click on the first card to open modal
  const cardClicked = await page.evaluate(() => {
    const card = document.querySelector("#property-discovery article");
    if (card) {
      card.click();
      return true;
    }
    return false;
  });
  console.log("Clicked card:", cardClicked);
  // Wait for image network load inside modal
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: "screenshot-section2-modal-loaded.png" });
  console.log("Saved: screenshot-section2-modal-loaded.png");

  // 3. Close modal
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 400));

  // 4. Test City Filter: Click 'Pune'
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("#property-discovery button"));
    const puneBtn = buttons.find((b) => b.textContent?.trim() === "Pune");
    if (puneBtn) puneBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: "screenshot-section2-pune-cards.png" });
  console.log("Saved: screenshot-section2-pune-cards.png");

  // 5. Test Search Input with page.type
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("#property-discovery button"));
    const allMetrosBtn = buttons.find((b) => b.textContent?.trim() === "All Metros");
    if (allMetrosBtn) allMetrosBtn.click();
  });
  await new Promise((r) => setTimeout(r, 300));

  const searchInput = await page.$('input[placeholder*="Search locality"]');
  if (searchInput) {
    await searchInput.type("Penthouse");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: "screenshot-section2-search-penthouse.png" });
    console.log("Saved: screenshot-section2-search-penthouse.png");

    // Clear search
    await page.evaluate(() => {
      const resetBtn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent?.includes("Reset All")
      );
      if (resetBtn) resetBtn.click();
    });
  }

  // 6. Test Empty state with search
  if (searchInput) {
    await searchInput.click();
    await searchInput.type("xyznonexistent999");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: "screenshot-section2-empty-state-verified.png" });
    console.log("Saved: screenshot-section2-empty-state-verified.png");
  }

  // 7. Mobile Viewport (390 x 844)
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const resetBtn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Reset All")
    );
    if (resetBtn) resetBtn.click();
    const el = document.getElementById("property-discovery");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: "screenshot-section2-mobile-view.png" });
  console.log("Saved: screenshot-section2-mobile-view.png");

  await browser.close();
  console.log("Verification finished successfully!");
}

runTest().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
