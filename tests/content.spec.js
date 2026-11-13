import { expect, test } from '@playwright/test';
import { site } from '../src/data/site.js';

// Contact details and business facts that must stay correct on the site.

const whatsappHrefs = site.whatsapp.map((number) => new RegExp(`^https://wa\\.me/${number.digits}\\?text=`));

async function expectExternal(link) {
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
}

test('footer lists both WhatsApp numbers, Instagram and the location', async ({ page }) => {
  await page.goto('/about');
  const footer = page.locator('footer');
  for (const [index, number] of site.whatsapp.entries()) {
    const link = footer.getByRole('link', { name: number.label });
    await expect(link).toHaveAttribute('href', whatsappHrefs[index]);
    await expectExternal(link);
  }
  const instagram = footer.getByRole('link', { name: site.instagram.handle });
  await expect(instagram).toHaveAttribute('href', site.instagram.url);
  await expectExternal(instagram);
  await expect(footer).toContainText(`Based in ${site.location.short}`);
});

test('contact page offers WhatsApp, email, Instagram and the location', async ({ page }) => {
  await page.goto('/contact');
  const aside = page.locator('aside');
  for (const number of site.whatsapp) {
    await expect(aside.getByRole('link', { name: number.label })).toBeVisible();
  }
  await expect(aside.getByRole('link', { name: site.email })).toBeVisible();
  await expect(aside.getByRole('link', { name: site.instagram.handle })).toBeVisible();
  await expect(aside).toContainText(site.location.line);
});

test('closing band and mobile menu have a WhatsApp button', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/services');
  const band = page.getByRole('region', { name: 'Start a project' });
  await expect(band.getByRole('link', { name: /WhatsApp us/ })).toHaveAttribute('href', whatsappHrefs[0]);

  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menuLink = page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: /WhatsApp us/ });
  await expect(menuLink).toBeVisible();
  await expect(menuLink).toHaveAttribute('href', whatsappHrefs[0]);
});

test('structured data gives the city, never a street address', async ({ page }) => {
  await page.goto('/');
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  const organization = JSON.parse(json)['@graph'].find((item) => item['@type'] === 'Organization');
  expect(organization.address).toMatchObject({
    addressLocality: 'Ooty',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  });
  expect(organization.address.streetAddress).toBeUndefined();
  expect(organization.sameAs).toContain(site.instagram.url);
  expect(organization.contactPoint.map((point) => point.telephone)).toEqual(
    site.whatsapp.map((number) => `+${number.digits}`)
  );
});

test('privacy policy names the business, the keep-time and Gmail', async ({ page }) => {
  await page.goto('/privacy');
  const main = page.locator('main');
  await expect(main).toContainText('Last updated:');
  await expect(main).toContainText(`run by ${site.name}`);
  await expect(main).toContainText('deleted within 12 months');
  await expect(main).toContainText('Gmail');
});

test('the admin panel is described as optional', async ({ page }) => {
  await page.goto('/process');
  await page.getByText('Can I update my website myself?').click();
  await expect(page.locator('main')).toContainText('A simple portfolio can go without one.');
  await page.goto('/services/websites');
  await expect(page.locator('main')).toContainText('An admin panel, if you need one');
});
