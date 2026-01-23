import { test, expect } from '@playwright/test';
import { registerAndLogin } from '../src/playwrite/auth.mjs';

test.describe('smoke: rotas principais', () => {
  test('abre cada página e valida o heading', async ({ page }) => {
    test.setTimeout(180000);

    await registerAndLogin(page);

    const cases = [
      { path: '/home', heading: 'Dashboard' },
      { path: '/transacoes', heading: 'Transações' },
      { path: '/categorias', heading: 'Categorias' },
      { path: '/contas', heading: 'Contas' },
      { path: '/orcamentos', heading: 'Orçamentos' },
      { path: '/despesas', heading: 'Despesas' },
      { path: '/contas-a-pagar', heading: 'Contas a Pagar' },
      { path: '/dividas', heading: 'Resumo de Dívidas' },
      { path: '/vencimentos', heading: 'Vencimentos' },
      { path: '/parcelamentos', heading: 'Parcelamentos' },
      { path: '/financiamentos', heading: 'Financiamentos' },
      { path: '/estoque', heading: 'Estoque' },
      { path: '/metas', heading: 'Metas' },
    ];

    for (const c of cases) {
      await page.goto(c.path);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByRole('heading', { name: c.heading })).toBeVisible({ timeout: 15000 });
    }
  });
});
