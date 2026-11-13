import { expect, test } from '@playwright/test';

// The GSAP scroll effects on the home page (desktop). The page is entered
// with reduced motion off; each test scrolls and reads the values the
// animations write (CSS variables and data attributes).

const wait = (page, ms) => page.waitForTimeout(ms);

async function openHome(page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

test('services showcase: turns the phone, steps through services and snaps', async ({ page }) => {
  await openHome(page);
  const box = await page.evaluate(() => {
    const section = document.querySelector('.showcase');
    return {
      top: section.getBoundingClientRect().top + window.scrollY,
      distance: section.offsetHeight - section.firstElementChild.offsetHeight,
      screens: section.offsetHeight / window.innerHeight,
      live: section.dataset.live,
    };
  });
  expect(box.live).toBe('true');
  expect(box.screens).toBeCloseTo(3, 1); // 1 screen + 2 extra (was 4 in total)

  // Stop 45% of the way through: the snap should settle on the middle service (progress 0.5).
  await page.evaluate(({ top, distance }) => window.scrollTo(0, top + distance * 0.45), box);
  await wait(page, 1800);
  const state = await page.evaluate(({ top, distance }) => {
    const section = document.querySelector('.showcase');
    return {
      progress: (window.scrollY - top) / distance,
      p: parseFloat(getComputedStyle(section).getPropertyValue('--p')),
      current: [...section.querySelectorAll('.showcase-item')].findIndex((item) => item.dataset.current),
    };
  }, box);
  expect(state.progress).toBeCloseTo(0.5, 1);
  expect(state.p).toBeCloseTo(0.5, 1);
  expect(state.current).toBe(2);
});

test('studio statement: the pills open as the heading scrolls into view', async ({ page }) => {
  await openHome(page);
  const title = page.locator('#studio-title');
  // heading's top at 85% of the screen height: just entered, so barely open
  await title.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - window.innerHeight * 0.85));
  await wait(page, 800);
  const early = await title.evaluate((el) => parseFloat(el.style.getPropertyValue('--p')));
  await title.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await wait(page, 1200);
  const late = await title.evaluate((el) => parseFloat(el.style.getPropertyValue('--p')));
  expect(early).toBeLessThan(0.6);
  expect(late).toBe(1);
});

test('selected work: a card scales back as the next one slides over it', async ({ page }) => {
  await openHome(page);
  const items = page.locator('.stack-item');
  await items.nth(1).evaluate((el) => {
    el.scrollIntoView({ block: 'start' });
    window.scrollBy(0, 200);
  });
  await wait(page, 1200);
  const covers = await items.evaluateAll((els) =>
    els.map((el) => parseFloat(el.style.getPropertyValue('--cover')) || 0)
  );
  expect(covers[0]).toBeGreaterThan(0.5); // first card is mostly covered
  expect(covers[covers.length - 1]).toBe(0); // nothing covers the last card
});

test('selected work: no stacking maths on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page
    .locator('.stack-item')
    .nth(1)
    .evaluate((el) => el.scrollIntoView());
  await wait(page, 800);
  const covers = await page
    .locator('.stack-item')
    .evaluateAll((els) => els.map((el) => el.style.getPropertyValue('--cover')));
  expect(covers.every((value) => value === '')).toBe(true);
});

test('header scrim appears once the page has scrolled past the hero top', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/about');
  const header = page.locator('.site-header');
  await expect(header).toHaveAttribute('data-scrolled', 'false');
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(header).toHaveAttribute('data-scrolled', 'true');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).toHaveAttribute('data-scrolled', 'false');
});

test('reduced motion: home effects stay in their finished state', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const state = await page.evaluate(() => ({
    live: document.querySelector('.showcase').dataset.live ?? null,
    studio: getComputedStyle(document.querySelector('#studio-title')).getPropertyValue('--p').trim(),
  }));
  expect(state.live).toBeNull(); // plain list, no pinned scroll section
  expect(state.studio).toBe('1'); // pills fully open
  await context.close();
});

test('spotlight cards light up under the mouse', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/about');
  const card = page.locator('.spotlight-card').first();
  await card.scrollIntoViewIfNeeded();
  const light = card.locator('.spotlight-card__light');
  expect(Number(await light.evaluate((el) => getComputedStyle(el).opacity))).toBe(0);
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
  await expect
    .poll(async () => Number(await light.evaluate((el) => getComputedStyle(el).opacity)))
    .toBeGreaterThan(0.05);
  await expect(card.locator('h3')).toBeVisible(); // content still on top
});

test('the main button leans towards a nearby mouse, and settles back', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/services');
  const button = page.getByRole('region', { name: 'Start a project' }).getByRole('link', { name: 'Start a project' });
  await button.scrollIntoViewIfNeeded();
  const inner = button.locator('xpath=..');
  const box = await button.boundingBox();
  await page.mouse.move(box.x + box.width + 30, box.y + box.height / 2, { steps: 5 });
  await expect.poll(() => inner.evaluate((el) => el.style.transform)).toContain('translate3d');
  await page.mouse.move(10, 10, { steps: 5 });
  await expect.poll(() => inner.evaluate((el) => el.style.transform)).toBe('');
});

test('reduced motion: no spotlight or magnet movement', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('/services');
  const button = page.getByRole('region', { name: 'Start a project' }).getByRole('link', { name: 'Start a project' });
  await button.scrollIntoViewIfNeeded();
  const box = await button.boundingBox();
  await page.mouse.move(box.x + box.width + 30, box.y + box.height / 2, { steps: 5 });
  await page.waitForTimeout(500);
  expect(await button.locator('xpath=..').evaluate((el) => el.style.transform)).toBe('');
  await context.close();
});

test('hero background pauses once the hero is off screen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/about');
  await page.locator('footer').getByRole('link', { name: 'Home' }).click(); // home without the intro
  const contours = page.locator('.hero-contours');
  await expect(contours).toHaveCSS('animation-play-state', 'running');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
  await expect(contours).toHaveCSS('animation-play-state', 'paused');
});
