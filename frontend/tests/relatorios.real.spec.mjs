import { test, expect } from '@playwright/test';

async function getAuthToken(page) {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) throw new Error('Token não encontrado no localStorage após login');
  return token;
}

test.describe('Relatórios (E2E - API real)', () => {
  test('gerar relatório + baixar PDF', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.relatorios+${timestamp}@example.com`;
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

    // Seed uma transação (para o relatório ter dados)
    const catResp = await page.request.fetch('http://localhost:5000/api/categorias', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: JSON.stringify({ nome: `Categoria Relatórios ${timestamp}`, tipo: 'receita' }),
    });
    const categoria = await catResp.json();

    const contaResp = await page.request.fetch('http://localhost:5000/api/contas', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: JSON.stringify({ nome: `Conta Relatórios ${timestamp}`, saldo: 0 }),
    });
    const conta = await contaResp.json();

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const isoDate = `${yyyy}-${mm}-${dd}`;

    await page.request.fetch('http://localhost:5000/api/transacoes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: JSON.stringify({
        conta: conta._id,
        categoria: categoria._id,
        descricao: `Transação Relatórios ${timestamp}`,
        valor: 100,
        data: new Date(isoDate).toISOString(),
        tipo: 'receita',
      }),
    });

    // Go to Relatórios
    await page.goto('/relatorios');
    await expect(page.getByRole('heading', { name: 'Relatórios Financeiros' })).toBeVisible({ timeout: 20000 });

    // Open modal
    await page.getByRole('button', { name: 'Gerar Relatório' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Gerar Relatório' });
    await expect(dialog).toBeVisible({ timeout: 15000 });

    // Fill range (today)
    await dialog.getByLabel('Data Inicial').fill(isoDate);
    await dialog.getByLabel('Data Final').fill(isoDate);

    const reportRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'GET' && resp.url().includes('/api/relatorios/completo') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await dialog.getByRole('button', { name: 'Gerar Relatório' }).click();
    await reportRespPromise;
    await expect(dialog).toBeHidden({ timeout: 20000 });

    // Cards should appear
    await expect(page.getByText('Resumo Financeiro')).toBeVisible({ timeout: 20000 });

    // Download PDF
    const downloadPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'GET' && resp.url().includes('/api/relatorios/pdf') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await page.getByRole('button', { name: 'Baixar PDF' }).click();
    await downloadPromise;
  });
});
