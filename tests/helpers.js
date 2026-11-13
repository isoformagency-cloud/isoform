// Shared helpers for the smoke tests.

// Collects console errors and uncaught exceptions (including React hydration
// errors, which React reports through console.error).
export function watchErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

// Text elements that stick out past the left or right edge of the viewport.
// The site clips horizontal overflow (body { overflow-x: clip }), so this is the
// only way such a bug would show up. Decorative layers are ignored.
export function findOverflow(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const selector = 'h1, h2, h3, p, a, li, button, label, input, textarea, dt, dd';
    return [...document.querySelectorAll(selector)]
      .filter((el) => !el.closest('[aria-hidden="true"], [inert], .intro-only'))
      .filter((el) => getComputedStyle(el).visibility !== 'hidden')
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width > 0 && (rect.right > width + 1 || rect.left < -1))
      .map(
        ({ el, rect }) =>
          `${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}" (${Math.round(rect.left)}–${Math.round(rect.right)}px)`
      );
  });
}
