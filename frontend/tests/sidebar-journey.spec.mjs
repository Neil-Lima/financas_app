import { test, expect } from '@playwright/test';
import { registerAndLogin } from '../src/playwrite/auth.mjs';

test('navega pelas páginas via Sidebar e valida headings principais', async ({ page }) => {
  test.setTimeout(240000);

  await registerAndLogin(page);

  const drawer = page.locator('.MuiDrawer-paper').first();

  const clickNav = async (label, expectedPathRegex) => {
    const target = drawer.locator('.MuiListItemButton-root', { hasText: label }).first();
    await expect(target).toBeVisible({ timeout: 15000 });

    await Promise.all([
      page.waitForURL(expectedPathRegex, { timeout: 15000 }),
      target.click(),
    ]);

    await page.waitForLoadState('domcontentloaded');
  };

  const expandSection = async (label) => {
    const sectionButton = drawer.locator('.MuiListItemButton-root', { hasText: label }).first();
    await expect(sectionButton).toBeVisible({ timeout: 15000 });

    const hasExpandLess = (await sectionButton.locator('svg[data-testid="ExpandLessIcon"]').count()) > 0;
    if (!hasExpandLess) {
      await sectionButton.click();
    }
  };

  // Dashboard
  await clickNav('Dashboard', /.*\/(home|dashboard)$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });

  // Finanças
  await expandSection('Finanças');

  await clickNav('Transações', /.*\/transacoes$/);
  await expect(page.getByRole('heading', { name: 'Transações' })).toBeVisible({ timeout: 15000 });

  await clickNav('Categorias', /.*\/categorias$/);
  await expect(page.getByRole('heading', { name: 'Categorias' })).toBeVisible({ timeout: 15000 });

  await clickNav('Contas', /.*\/contas$/);
  await expect(page.getByRole('heading', { name: 'Contas' })).toBeVisible({ timeout: 15000 });

  await clickNav('Orçamentos', /.*\/orcamentos$/);
  await expect(page.getByRole('heading', { name: 'Orçamentos' })).toBeVisible({ timeout: 15000 });

  await clickNav('Despesas', /.*\/despesas$/);
  await expect(page.getByRole('heading', { name: 'Despesas' })).toBeVisible({ timeout: 15000 });

  // Dívidas e Pagamentos
  await expandSection('Dívidas e Pagamentos');

  await clickNav('Contas a Pagar', /.*\/contas-a-pagar$/);
  await expect(page.getByRole('heading', { name: 'Contas a Pagar' })).toBeVisible({ timeout: 15000 });

  await clickNav('Resumo de Dívidas', /.*\/dividas$/);
  await expect(page.getByRole('heading', { name: 'Resumo de Dívidas' })).toBeVisible({ timeout: 15000 });

  await clickNav('Vencimentos', /.*\/vencimentos$/);
  await expect(page.getByRole('heading', { name: 'Vencimentos' })).toBeVisible({ timeout: 15000 });

  await clickNav('Parcelamentos', /.*\/parcelamentos$/);
  await expect(page.getByRole('heading', { name: 'Parcelamentos' })).toBeVisible({ timeout: 15000 });

  await clickNav('Financiamentos', /.*\/financiamentos$/);
  await expect(page.getByRole('heading', { name: 'Financiamentos' })).toBeVisible({ timeout: 15000 });

  // Itens fora das seções
  await clickNav('Estoque', /.*\/estoque$/);
  await expect(page.getByRole('heading', { name: 'Estoque' })).toBeVisible({ timeout: 15000 });

  await clickNav('Metas', /.*\/metas$/);
  await expect(page.getByRole('heading', { name: 'Metas' })).toBeVisible({ timeout: 15000 });
});
