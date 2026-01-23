import { test, expect } from '@playwright/test';

async function getAuthToken(page) {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) throw new Error('Token não encontrado no localStorage após login');
  return token;
}

test.describe('Dívidas (E2E - API real)', () => {
  test('carrega resumo e lista de próximos vencimentos', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.dividas+${timestamp}@example.com`;
    const password = 'Teste@123';

    // Register
    await page.goto('/');
    await page.getByRole('button', { name: 'Não tem uma conta? Registre-se aqui' }).click();
    const registerDialog = page.getByRole('dialog');
    await expect(registerDialog).toBeVisible({ timeout: 15000 });
    await registerDialog.getByPlaceholder('Seu nome').fill(name);
    await registerDialog.getByPlaceholder('Seu email').fill(email);
    await registerDialog.getByPlaceholder('Sua senha').fill(password);
    const registerRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'POST' && resp.url().includes('/api/usuarios/register'),
      { timeout: 30000 }
    );
    await registerDialog.getByRole('button', { name: 'Registrar' }).click();
    await registerRespPromise;

    // Login
    await page.getByPlaceholder('Seu email').first().fill(email);
    await page.getByPlaceholder('Sua senha').first().fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/home', { timeout: 20000 });

    const token = await getAuthToken(page);

    // Seed financiamento e parcelamento para gerar resumo
    const iso = new Date().toISOString();

    const catResp = await page.request.fetch('http://localhost:5000/api/categorias', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: JSON.stringify({ nome: `Categoria Dívidas ${timestamp}`, tipo: 'despesa' }),
    });
    const categoria = await catResp.json();

    await page.request.fetch('http://localhost:5000/api/parcelamentos', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: JSON.stringify({
        descricao: `Parcelamento Dívidas ${timestamp}`,
        valorTotal: 50,
        numeroParcelas: 2,
        dataInicio: iso,
        categoria: categoria._id,
      }),
    });

    await page.request.fetch('http://localhost:5000/api/financiamentos', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: JSON.stringify({
        descricao: `Financiamento Dívidas ${timestamp}`,
        valor_total: 70,
        taxa_juros: 1,
        parcelas_totais: 2,
        data_inicio: iso,
      }),
    });

    // Go to Dividas
    await page.goto('/dividas');
    await expect(page.getByRole('heading', { name: 'Resumo de Dívidas' })).toBeVisible({ timeout: 20000 });

    // Should show cards populated (at least non-empty)
    await expect(page.getByText('Total em Dívidas')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Parcelamentos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Financiamentos' })).toBeVisible();

    // Próximos vencimentos table
    await expect(page.getByRole('table')).toBeVisible({ timeout: 20000 });
  });
});
