import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { routes } from '../src/seo.js';

// Automatic accessibility scan (axe-core, WCAG 2.1 A and AA) of every page.
// Reduced motion is on so every element is scanned in its final, settled state
// (mid-animation text would give false colour-contrast failures).
// Fails on "serious" and "critical" problems.
test.use({ reducedMotion: 'reduce' });

for (const route of [...routes, '/admin', '/this-does-not-exist']) {
  test(`accessibility: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

    const problems = results.violations
      .filter((violation) => ['serious', 'critical'].includes(violation.impact))
      .map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help}, ${violation.nodes.length} element(s): ${violation.nodes
            .map((node) => node.target.join(' '))
            .slice(0, 3)
            .join(' | ')}`
      );
    expect(problems).toEqual([]);
  });
}
