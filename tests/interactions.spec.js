import { expect, test } from '@playwright/test';
import { watchErrors } from './helpers.js';

test.describe('navigation', () => {
  test('skip link moves focus to the main content', async ({ page }) => {
    await page.goto('/about');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });

  test('desktop services drop-down opens and closes with the keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/about');
    const menu = page.locator('#services-menu');
    await expect(menu).toBeHidden();
    await page.getByRole('button', { name: 'Show all services' }).focus();
    await page.keyboard.press('Enter');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: /Automation/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });

  // Regression test for FIX-PLAN.md 3.10: hovering opened the menu, then the
  // click on the arrow toggled it shut again.
  test('desktop services drop-down stays open when the arrow is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/about');
    await page.getByRole('button', { name: 'Show all services' }).click();
    await page.waitForTimeout(400);
    await expect(page.locator('#services-menu')).toBeVisible({ timeout: 1_000 });
  });

  test('desktop services drop-down opens on hover and closes when the mouse leaves', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/about');
    const menu = page.locator('#services-menu');
    await page.locator('.site-header .nav-link', { hasText: 'Services' }).hover();
    await expect(menu).toBeVisible();
    await page.mouse.move(640, 600);
    await expect(menu).toBeHidden();
  });

  test('mobile menu opens, traps focus and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/about');
    const openButton = page.getByRole('button', { name: 'Menu', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Menu' });

    await openButton.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(openButton).toBeFocused();
  });

  test('client-side navigation updates the title and focuses main', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/about');
    await page.locator('footer').getByRole('link', { name: 'Process' }).click();
    await expect(page).toHaveURL(/\/process$/);
    await expect(page).toHaveTitle('Process | ISOFORM');
    await expect(page.locator('main')).toBeFocused();
  });
});

test.describe('home intro', () => {
  test('"Scroll to come in" plays the intro and reveals the header', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const errors = watchErrors(page);
    await page.goto('/');
    const header = page.locator('.site-header');
    await expect(header).toBeHidden(); // hidden while the intro is on screen

    await page.getByRole('button', { name: /Scroll to come in/ }).click();
    await expect(header).toBeVisible({ timeout: 5_000 });
    expect(errors).toEqual([]);
  });

  test('the intro only plays when the visit starts on the home page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/about');
    await page.locator('footer').getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.intro-stage')).toHaveCount(0);
    await expect(page.locator('.site-header')).toBeVisible();

    // and after leaving the home page and coming back with the Back button
    await page.locator('footer').getByRole('link', { name: 'Work' }).click();
    await page.goBack();
    await expect(page.locator('.intro-stage')).toHaveCount(0);
  });

  test('with reduced motion there is no intro', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('h1')).toBeInViewport();
    await context.close();
  });
});

test.describe('work page', () => {
  test('filters show only the chosen type', async ({ page }) => {
    await page.goto('/work');
    const cards = page.locator('main article');
    await expect(cards).toHaveCount(6);

    const social = page.getByRole('button', { name: 'Social media' });
    await social.click();
    await expect(social).toHaveAttribute('aria-pressed', 'true');
    await expect(cards).toHaveCount(2);

    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(cards).toHaveCount(6);
  });
});

// The form tests answer /api/contact with a fake reply, so no email is ever sent.
test.describe('contact form', () => {
  const fillValid = async (page) => {
    await page.getByLabel('Your name').fill('Test Person');
    await page.getByLabel('Email or phone').fill('test@example.com');
    await page.getByRole('checkbox', { name: 'Websites' }).check();
    await page.getByLabel('Tell us about the project').fill('A short test message about a project.');
  };

  test('empty submit shows every error and focuses the first field', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /Send enquiry/ }).click();
    await expect(page.locator('.field-error')).toHaveCount(4);
    await expect(page.getByLabel('Your name')).toBeFocused();
    await expect(page.getByLabel('Your name')).toHaveAttribute('aria-invalid', 'true');
  });

  test('a service link pre-ticks that service', async ({ page }) => {
    await page.goto('/contact?service=automation');
    await expect(page.getByRole('checkbox', { name: 'Automation' })).toBeChecked();
  });

  test('successful send shows the thank-you message', async ({ page }) => {
    let sent;
    await page.route('**/api/contact', async (route) => {
      sent = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await page.goto('/contact');
    await fillValid(page);
    await page.getByRole('button', { name: /Send enquiry/ }).click();

    await expect(page.getByRole('heading', { name: /Thank you/ })).toBeVisible();
    expect(sent).toMatchObject({ name: 'Test Person', contact: 'test@example.com', services: ['Websites'] });
    expect(sent.company_url).toBe('');
    expect(sent.elapsed).toBeGreaterThan(0); // time since the form appeared, for the server's bot check
  });

  // Real request to the local server (no fake reply): proves a genuine browser
  // submission passes the Origin and time checks. The test server has no mail
  // settings, so it stops at "not configured" and nothing is sent.
  test('a real submission passes the spam checks', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(2_200); // a person takes at least this long
    await fillValid(page);
    const responsePromise = page.waitForResponse('**/api/contact');
    await page.getByRole('button', { name: /Send enquiry/ }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(503);
    expect((await response.json()).error).toBe('not_configured');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('failed send shows the error and the email address', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false,"error":"not_configured"}' })
    );
    await page.goto('/contact');
    await fillValid(page);
    await page.getByRole('button', { name: /Send enquiry/ }).click();

    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert.getByRole('link', { name: /@/ })).toHaveAttribute('href', /^mailto:/);
  });
});
