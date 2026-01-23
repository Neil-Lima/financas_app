import { test, expect } from '@playwright/test';
import { registerAndLogin } from '../../../playwrite/auth.mjs';

test('navega pelas páginas via Sidebar (ordem) e valida elementos principais', async ({ page }) => {
  test.setTimeout(180000);

  await registerAndLogin(page);

  const drawer = page.locator('.MuiDrawer-paper').first();

  const clickNav = async (label, expectedPathRegex) => {
    // Evita problemas de "strict mode" e mudanças de DOM durante navegação.
    // Clicamos no container clicável do MUI (ListItemButton) que contém o texto.
    const target = drawer.locator('.MuiListItemButton-root', { hasText: label }).first();
    await expect(target).toBeVisible({ timeout: 15000 });

    await Promise.all([
      page.waitForURL(expectedPathRegex, { timeout: 15000 }),
      target.click(),
    ]);

    await page.waitForLoadState('domcontentloaded');
  };

  const expandSection = async (label) => {
    // Tenta abrir a seção somente se os itens não estiverem visíveis.
    const sectionButton = drawer.locator('.MuiListItemButton-root', { hasText: label }).first();
    await expect(sectionButton).toBeVisible({ timeout: 15000 });

    // Se já está aberto (tem ExpandLess visível dentro), não clica.
    const hasExpandLess = (await sectionButton.locator('svg[data-testid="ExpandLessIcon"]').count()) > 0;
    if (!hasExpandLess) {
      await sectionButton.click();
    }
  };

  // Dashboard
  await clickNav('Dashboard', /.*\/home$/);
  await expect(page.getByText('Despesas por Categoria')).toBeVisible({ timeout: 15000 });

  // Finanças
  await expandSection('Finanças');

  await clickNav('Transações', /.*\/transacoes$/);
  await expect(page.getByRole('heading', { name: 'Transações' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Nova Transação')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Lista de Transações')).toBeVisible({ timeout: 15000 });

  await clickNav('Orçamentos', /.*\/orcamentos$/);
  await expect(page.getByRole('heading', { name: 'Orçamentos' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Novo Orçamento')).toBeVisible({ timeout: 15000 });

  await clickNav('Despesas', /.*\/despesas$/);
  await expect(page.getByRole('heading', { name: 'Despesas' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Nova Despesa')).toBeVisible({ timeout: 15000 });

  // Dívidas e Pagamentos
  await expandSection('Dívidas e Pagamentos');

  await clickNav('Contas a Pagar', /.*\/contas$/);
  await expect(page.getByRole('heading', { name: 'Contas' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Nova Conta')).toBeVisible({ timeout: 15000 });

  await clickNav('Parcelamentos', /.*\/parcelamentos$/);
  await expect(page.getByRole('heading', { name: 'Parcelamentos' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Novo Parcelamento')).toBeVisible({ timeout: 15000 });

  await clickNav('Financiamentos', /.*\/financiamentos$/);
  await expect(page.getByRole('heading', { name: 'Financiamentos' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Novo Financiamento')).toBeVisible({ timeout: 15000 });

  // Itens fora das seções
  await clickNav('Estoque', /.*\/estoque$/);
  await expect(page.getByRole('heading', { name: 'Estoque' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Novo Produto')).toBeVisible({ timeout: 15000 });

  await clickNav('Metas', /.*\/metas$/);
  await expect(page.getByRole('heading', { name: 'Metas' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Nova Meta')).toBeVisible({ timeout: 15000 });

  await clickNav('Usuários', /.*\/usuarios$/);
  await expect(page.getByRole('heading', { name: 'Usuários' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Lista de Usuários')).toBeVisible({ timeout: 15000 });
});
