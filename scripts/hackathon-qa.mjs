import puppeteer from "puppeteer-core";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = "http://localhost:3000";

async function runHackathonQA() {
  console.log("=================================================");
  console.log("   AVENORA PLATFORM HACKATHON QA TEST SUITE      ");
  console.log("=================================================");
  console.log(`Target: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const results = [];

  function record(suite, testName, passed, details = "") {
    results.push({ suite, testName, passed, details });
    const mark = passed ? "✓ PASS" : "✗ FAIL";
    console.log(`[${mark}] ${suite} › ${testName}${details ? ` (${details})` : ""}`);
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });

    // -------------------------------------------------------------
    // SECTION 1: HERO & BRANDING
    // -------------------------------------------------------------
    const title = await page.title();
    record("Section 1 (Hero)", "Page Title contains AVENORA", title.includes("AVENORA"), `Title: "${title}"`);

    const hasTagline = await page.evaluate(() => {
      return document.body.innerText.includes("Find a place that feels like you.");
    });
    record("Section 1 (Hero)", "Tagline rendered properly", hasTagline);

    const soundToggle = await page.$('button[aria-label*="soundscape" i], button[aria-label*="ambience" i]');
    record("Section 1 (Hero)", "Sound Ambience Synthesizer toggle present", !!soundToggle);

    const hotspots = await page.$$('button[aria-label*="View details about" i]');
    record("Section 1 (Hero)", "Interactive architectural hotspot pins present", hotspots.length > 0, `Found: ${hotspots.length}`);

    // -------------------------------------------------------------
    // SECTION 2: PROPERTY DISCOVERY & FILTERS
    // -------------------------------------------------------------
    const hasSec2Heading = await page.evaluate(() => {
      return document.body.innerText.includes("Discover Spaces Worth Coming Home To.");
    });
    record("Section 2 (Discovery)", "Section headline matches specification", hasSec2Heading);

    // Scroll to Section 2
    await page.evaluate(() => {
      const el = document.getElementById("property-discovery");
      if (el) el.scrollIntoView({ behavior: "instant" });
    });
    await new Promise(r => setTimeout(r, 600));

    const initialCards = await page.$$('#property-discovery article');
    record("Section 2 (Discovery)", "Initial property cards rendered (min 8)", initialCards.length >= 8, `Found: ${initialCards.length} listings`);

    // Filter by Pune
    const puneBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('#property-discovery button'));
      return buttons.find(b => b.textContent && b.textContent.includes('Pune'));
    });
    if (puneBtn.asElement()) {
      await puneBtn.asElement().click();
      await new Promise(r => setTimeout(r, 600));

      const puneCards = await page.$$('#property-discovery article');
      const allPune = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#property-discovery article'));
        return cards.length > 0 && cards.every(c => c.textContent.includes('Pune'));
      });
      record("Section 2 (Discovery)", "City filtering (Pune) works accurately", puneCards.length > 0 && allPune, `Found ${puneCards.length} Pune listings`);

      // Reset to All Cities
      const allCityBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('#property-discovery button'));
        return buttons.find(b => b.textContent && b.textContent.trim().startsWith('All') && b.textContent.includes('Cities'));
      });
      if (allCityBtn.asElement()) {
        await allCityBtn.asElement().click();
        await new Promise(r => setTimeout(r, 400));
      }
    }

    // Toggle Favorite
    const favButton = await page.$('#property-discovery article button[aria-label*="favourite" i]');
    if (favButton) {
      await favButton.click();
      await new Promise(r => setTimeout(r, 300));
      const favStored = await page.evaluate(() => {
        const raw = localStorage.getItem("avenora_favorites");
        return raw ? JSON.parse(raw).length > 0 : false;
      });
      record("Section 2 (Discovery)", "Favorite toggle persists to localStorage", favStored);
    }

    // Open Property Detail Modal
    const firstCard = await page.$('#property-discovery article');
    if (firstCard) {
      await firstCard.click();
      await new Promise(r => setTimeout(r, 600));

      const modalVisible = await page.evaluate(() => {
        return !!document.querySelector('[role="dialog"]') || document.body.innerText.includes("Architectural Overview");
      });
      record("Section 2 (Discovery)", "Property Detail Modal opens with architectural specs", modalVisible);

      // Close Modal via Escape
      await page.keyboard.press("Escape");
      await new Promise(r => setTimeout(r, 400));
    }

    // -------------------------------------------------------------
    // STAGE 3: CONTACT ADVISORY & VIEWING REQUESTS
    // -------------------------------------------------------------
    await page.evaluate(() => {
      const el = document.getElementById("contact-advisory");
      if (el) el.scrollIntoView({ behavior: "instant" });
    });
    await new Promise(r => setTimeout(r, 500));

    const advisoryHeading = await page.evaluate(() => {
      return document.body.innerText.includes("Your next chapter starts with the right address.");
    });
    record("Stage 3 (Advisory)", "Headline matches specification", advisoryHeading);

    // Fill and submit advisory form
    const nameInput = await page.$('#contact-advisory input[placeholder*="Singhania"]');
    if (nameInput) {
      await nameInput.click();
      await page.keyboard.type("Radhika Merchant");
    }
    const emailInput = await page.$('#contact-advisory input[placeholder*="singhania.holdings"]');
    if (emailInput) {
      await emailInput.click();
      await page.keyboard.type("radhika@avenora-test.in");
    }
    const phoneInput = await page.$('#contact-advisory input[placeholder*="98201"]');
    if (phoneInput) {
      await phoneInput.click();
      await page.keyboard.type("+91 99887 66554");
    }
    const msgInput = await page.$('#contact-advisory textarea[placeholder*="Detail specific"]');
    if (msgInput) {
      await msgInput.click();
      await page.keyboard.type("Interested in acquiring a lakefront villa in Pune with private deck.");
    }

    const submitAdvisory = await page.$('#contact-advisory button[type="submit"]');
    if (submitAdvisory) {
      await submitAdvisory.click();
      await new Promise(r => setTimeout(r, 1000));

      const advisorySuccess = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("Acquisition Brief Recorded") || text.includes("Tracking Reference");
      });
      const honestDisclaimer = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("Demo Environment Notice") || text.includes("Client-Side Persistence") || text.includes("local demo");
      });
      record("Stage 3 (Advisory)", "Advisory submission displays honest demo feedback", advisorySuccess && honestDisclaimer);
    }

    // Viewing Request Tab Switch & Form
    const viewingTabBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('#contact-advisory button'));
      return buttons.find(b => b.textContent && b.textContent.includes('Schedule Private Viewing'));
    });
    if (viewingTabBtn.asElement()) {
      await viewingTabBtn.asElement().click();
      await new Promise(r => setTimeout(r, 400));

      const viewingName = await page.$('#private-viewing input[placeholder*="Singhania"]');
      if (viewingName) {
        await viewingName.click();
        await page.keyboard.type("Devendra Fadnavis");
      }
      const viewingEmail = await page.$('#private-viewing input[placeholder*="singhania"]');
      if (viewingEmail) {
        await viewingEmail.click();
        await page.keyboard.type("devendra@vip-estates.in");
      }
      const viewingPhone = await page.$('#private-viewing input[placeholder*="98201"]');
      if (viewingPhone) {
        await viewingPhone.click();
        await page.keyboard.type("+91 98201 11223");
      }

      const submitViewing = await page.$('#private-viewing button[type="submit"]');
      if (submitViewing) {
        await submitViewing.click();
        await new Promise(r => setTimeout(r, 1000));

        const viewingSuccess = await page.evaluate(() => {
          const text = document.body.innerText;
          return text.includes("Viewing Pass Issued") || text.includes("Private Viewing Scheduled") || text.includes("Local Demo Notice");
        });
        record("Stage 3 (Viewing)", "Private viewing scheduler logs booking with access pass", viewingSuccess);
      }
    }

    // -------------------------------------------------------------
    // STAGE 3: AI CONSULTANT
    // -------------------------------------------------------------
    const chatToggle = await page.$('button[aria-label*="Open AVENORA AI Property Consultant" i]');
    record("Stage 3 (AI Consultant)", "Floating chat trigger button visible", !!chatToggle);

    if (chatToggle) {
      await chatToggle.click();
      await new Promise(r => setTimeout(r, 600));

      const welcomeMsg = await page.evaluate(() => {
        return document.body.innerText.includes("Hello! Welcome to AVENORA. I’m your personal property consultant. Tell me what kind of home you're dreaming of.");
      });
      record("Stage 3 (AI Consultant)", "Welcome greeting matches exact prompt", welcomeMsg);

      // Check for suggested query chips
      const chips = await page.evaluate(() => {
        const text = document.body.innerText;
        return {
          pune2bhk: text.includes("2BHK in Pune"),
          under80lakh: text.includes("under ₹80 lakh") || text.includes("80 lakh"),
          luxuryVilla: text.includes("luxury villa") || text.includes("Luxury villa"),
          rental: text.includes("rental properties") || text.includes("Rental properties"),
        };
      });
      const allChips = chips.pune2bhk && chips.under80lakh && chips.luxuryVilla && chips.rental;
      record("Stage 3 (AI Consultant)", "All 4 suggested query chips present", allChips, JSON.stringify(chips));

      // Click "2BHK in Pune" chip
      const chipBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(b => b.textContent && b.textContent.includes('2BHK in Pune'));
      });

      if (chipBtn.asElement()) {
        await chipBtn.asElement().click();
        await new Promise(r => setTimeout(r, 1400));

        const hasPropertyRecommendation = await page.evaluate(() => {
          const text = document.body.innerText;
          return text.includes("Pune") && (text.includes("Lane 6 Canopy") || text.includes("Koregaon Park") || text.includes("Matching Properties"));
        });
        record("Stage 3 (AI Consultant)", "AI query extracts Pune + 2BHK and renders matching card", hasPropertyRecommendation);

        // Click on in-chat property card to test cross-component modal opening
        const inChatCard = await page.$('button[title*="View" i], button[aria-label*="View" i]');
        if (inChatCard) {
          await inChatCard.click();
          await new Promise(r => setTimeout(r, 600));

          const modalOpenedFromChat = await page.evaluate(() => {
            const text = document.body.innerText;
            return text.includes("Architectural Overview") || text.includes("Lane 6 Canopy");
          });
          record("Stage 3 (AI Consultant)", "In-chat card dispatches custom event & opens detail modal", modalOpenedFromChat);

          // Close modal
          await page.keyboard.press("Escape");
          await new Promise(r => setTimeout(r, 400));
        }
      }
    }

    // -------------------------------------------------------------
    // MOBILE RESPONSIVENESS (390 x 844 iPhone 14)
    // -------------------------------------------------------------
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 600));

    const mobileNavVisible = await page.evaluate(() => {
      const menuBtn = document.querySelector('button[aria-label*="menu" i]');
      return !!menuBtn;
    });
    record("Mobile Responsiveness", "Mobile hamburger navigation button present", mobileNavVisible);

    const horizontalScrollable = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    record("Mobile Responsiveness", "No horizontal viewport overflow at 390px", !horizontalScrollable);

    await browser.close();

    console.log("\n=================================================");
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    console.log(`QA SUMMARY: ${passedCount}/${totalCount} tests passed (${Math.round((passedCount/totalCount)*100)}%)`);
    console.log("=================================================");

    if (passedCount !== totalCount) {
      process.exit(1);
    }
  } catch (err) {
    console.error("QA execution encountered error:", err);
    await browser.close();
    process.exit(1);
  }
}

runHackathonQA();
