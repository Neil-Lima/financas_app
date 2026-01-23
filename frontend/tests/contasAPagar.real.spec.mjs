import { test, expect } from '@playwright/test';

async function getAuthToken(page) {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) throw new Error('Token não encontrado no localStorage após login');
  return token;
}

test.describe('Contas a Pagar (E2E - API real)', () => {
  test('criar + editar + detalhes + excluir', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.contasapagar+${timestamp}@example.com`;
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

    await getAuthToken(page);

    // Go to Contas a Pagar
    await page.goto('/contas-a-pagar');
    await expect(page.getByRole('heading', { name: 'Contas a Pagar' })).toBeVisible({ timeout: 20000 });

    const descricao = `Conta a pagar UI Real ${timestamp}`;

    // Create
    await page.getByRole('button', { name: 'Nova Conta a Pagar' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Nova Conta a Pagar' });
    await expect(dialog).toBeVisible({ timeout: 15000 });

    await dialog.getByLabel('Descrição').fill(descricao);
    await dialog.getByLabel('Valor').fill('123.45');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    await dialog.getByLabel('Vencimento').fill(iso);

    const postRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'POST' && resp.url().includes('/api/contas-a-pagar') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await dialog.getByRole('button', { name: 'Adicionar' }).click();
    await postRespPromise;
    await expect(dialog).toBeHidden({ timeout: 20000 });

    const table = page.getByRole('table');
    await expect(table.getByRole('cell', { name: descricao }).first()).toBeVisible({ timeout: 20000 });

    // Details
    const row = table.getByRole('row', { name: new RegExp(descricao) }).first();
    await row.getByLabel(new RegExp(`detalhes conta a pagar ${descricao}`)).click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes da Conta a Pagar' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText(descricao)).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Edit
    await row.getByLabel(new RegExp(`editar conta a pagar ${descricao}`)).click();
    await expect(row.locator('input[name="descricao"]')).toBeVisible({ timeout: 15000 });

    const descricaoEdit = `${descricao} Edit`;
    await row.locator('input[name="descricao"]').fill(descricaoEdit);

    const patchRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'PATCH' && resp.url().includes('/api/contas-a-pagar/') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await row.getByLabel(new RegExp(`salvar conta a pagar ${descricaoEdit}`)).click();
    await patchRespPromise;

    await expect(table.getByRole('cell', { name: descricaoEdit }).first()).toBeVisible({ timeout: 20000 });

    // Delete
    page.on('dialog', async (d) => {
      if (d.type() === 'confirm') await d.accept();
      else await d.dismiss();
    });

    const editedRow = table.getByRole('row', { name: new RegExp(descricaoEdit) }).first();
    await editedRow.getByLabel(new RegExp(`excluir conta a pagar ${descricaoEdit}`)).click();
    await expect(table.getByRole('cell', { name: descricaoEdit })).toHaveCount(0, { timeout: 20000 });
  });
});
