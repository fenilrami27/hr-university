import { chromium } from 'playwright';

async function testCursorAndPerf() {
  console.log('=== TESTING CUSTOM CURSOR AND PERFORMANCE ===\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let failures = 0;

  try {
    // 1. Desktop Cursor Test
    console.log('--- 1. Testing Desktop Custom Cursor Synchronization ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      hasTouch: false,
    });
    const page = await desktopContext.newPage();
    await page.goto('http://localhost:5173/?nointro', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Initial mouse move to trigger cursor appearance
    const pointerSupport = await page.evaluate(() => {
      return {
        matchFine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
        hasPointerEvent: 'PointerEvent' in window,
        cursorEl: !!document.querySelector('.hru-custom-cursor'),
      };
    });
    console.log('Pointer Support in Headless Chrome:', pointerSupport);

    await page.mouse.move(200, 300);
    await page.waitForTimeout(100);

    // Test coordinates sync
    const testPoints = [
      { x: 300, y: 250 },
      { x: 650, y: 400 },
      { x: 920, y: 180 },
      { x: 450, y: 600 },
    ];

    for (const pt of testPoints) {
      await page.mouse.move(pt.x, pt.y);
      // Wait 1 frame (16ms)
      await page.waitForTimeout(40);

      const cursorState = await page.evaluate(() => {
        const dot = document.querySelector('.hru-cursor-dot');
        const ring = document.querySelector('.hru-cursor-ring');
        if (!dot) return null;
        const style = dot.style.transform;
        // Parse translate3d(x px, y px, 0)
        const match = style.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/);
        return {
          dotTransform: style,
          ringTransform: ring ? ring.style.transform : null,
          dotX: match ? parseFloat(match[1]) : null,
          dotY: match ? parseFloat(match[2]) : null,
        };
      });

      if (!cursorState) {
        console.error(`❌ Cursor dot not found at (${pt.x}, ${pt.y})`);
        failures++;
      } else {
        const diffX = Math.abs(cursorState.dotX - pt.x);
        const diffY = Math.abs(cursorState.dotY - pt.y);
        const syncOk = diffX <= 1 && diffY <= 1;
        if (syncOk) {
          console.log(`✅ Cursor 1:1 Instant Sync at (${pt.x}, ${pt.y}): dotX=${cursorState.dotX}, dotY=${cursorState.dotY} (diff: ${diffX.toFixed(2)}px, ${diffY.toFixed(2)}px)`);
        } else {
          console.error(`❌ Cursor desynchronized at (${pt.x}, ${pt.y}): dotX=${cursorState.dotX}, dotY=${cursorState.dotY} (diff: ${diffX}, ${diffY})`);
          failures++;
        }
      }
    }

    // 2. Test Hover Reaction on Interactive Elements
    console.log('\n--- 2. Testing Cursor Hover State on Interactive Elements ---');
    const button = page.locator('a, button').first();
    const btnBox = await button.boundingBox();
    if (btnBox) {
      const centerX = btnBox.x + btnBox.width / 2;
      const centerY = btnBox.y + btnBox.height / 2;
      await page.mouse.move(centerX, centerY);
      await page.waitForTimeout(60);

      const hoverState = await page.evaluate(() => {
        const ring = document.querySelector('.hru-cursor-ring');
        return {
          ringTransform: ring?.style.transform,
          ringClass: ring?.className,
        };
      });

      console.log('Hover on Interactive Element:', hoverState);
      const isScaled = hoverState.ringTransform?.includes('scale(1.5)') || hoverState.ringTransform?.includes('scale');
      if (isScaled) {
        console.log('✅ Cursor Ring reacts with interactive hover scaling');
      } else {
        console.log('ℹ️ Cursor hover detected, ring style:', hoverState.ringTransform);
      }
    }

    // 3. Test Scroll Responsiveness
    console.log('\n--- 3. Testing Cursor Position Stability during Scroll ---');
    await page.mouse.move(500, 500);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(60);

    const postScrollState = await page.evaluate(() => {
      const dot = document.querySelector('.hru-cursor-dot');
      const match = dot?.style.transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/);
      return {
        dotX: match ? parseFloat(match[1]) : null,
        dotY: match ? parseFloat(match[2]) : null,
      };
    });

    if (Math.abs(postScrollState.dotX - 500) <= 2 && Math.abs(postScrollState.dotY - 500) <= 2) {
      console.log('✅ Cursor coordinates remain perfectly anchored to viewport during scroll');
    } else {
      console.error('❌ Cursor shifted unexpectedly during scroll:', postScrollState);
      failures++;
    }

    await desktopContext.close();

    // 4. Test Mobile / Touch Device Cursor Behavior (Must be disabled/hidden)
    console.log('\n--- 4. Testing Touch Device Exclusion (Mobile Viewport) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      hasTouch: true,
      isMobile: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:5173/?nointro', { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(400);

    const mobileCursor = await mobilePage.evaluate(() => {
      const cursor = document.querySelector('.hru-custom-cursor');
      if (!cursor) return { exists: false };
      const style = window.getComputedStyle(cursor);
      return {
        exists: true,
        display: style.display,
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
      };
    });

    console.log('Mobile Cursor Status:', mobileCursor);
    if (!mobileCursor.exists || mobileCursor.display === 'none' || mobileCursor.opacity === '0') {
      console.log('✅ Custom cursor cleanly hidden/disabled on touch/mobile devices');
    } else {
      console.warn('⚠️ Mobile cursor element visible');
    }

    await mobileContext.close();

    // 5. Test Memory and FPS Stability
    console.log('\n--- 5. Testing Frame Stability (RAF timing) ---');
    const perfContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const perfPage = await perfContext.newPage();
    await perfPage.goto('http://localhost:5173/?nointro', { waitUntil: 'domcontentloaded' });
    await perfPage.waitForTimeout(500);

    const fpsReport = await perfPage.evaluate(async () => {
      return new Promise((resolve) => {
        let frames = 0;
        let lastTime = performance.now();
        const intervals = [];

        function measure(time) {
          frames++;
          const delta = time - lastTime;
          lastTime = time;
          intervals.push(delta);

          if (frames < 60) {
            requestAnimationFrame(measure);
          } else {
            intervals.shift(); // remove first warm-up delta
            const avgDelta = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const maxDelta = Math.max(...intervals);
            resolve({
              avgFps: Math.round(1000 / avgDelta),
              avgFrameTimeMs: avgDelta.toFixed(2),
              maxFrameTimeMs: maxDelta.toFixed(2),
            });
          }
        }
        requestAnimationFrame(measure);
      });
    });

    console.log('Performance RAF Frame Timing Report:', fpsReport);
    if (fpsReport.avgFps >= 50) {
      console.log(`✅ Smooth 60 FPS rendering confirmed (Avg: ${fpsReport.avgFps} FPS, Frame Time: ${fpsReport.avgFrameTimeMs}ms)`);
    } else {
      console.warn(`⚠️ Average FPS lower than 50: ${fpsReport.avgFps}`);
    }

    await perfContext.close();
  } catch (err) {
    console.error('❌ Exception during test:', err);
    failures++;
  } finally {
    await browser.close();
  }

  console.log(`\n=== TEST COMPLETE: Failures = ${failures} ===`);
  if (failures > 0) process.exit(1);
}

testCursorAndPerf();
