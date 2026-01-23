import { test, expect } from '@playwright/test';

async function getAuthToken(page) {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) throw new Error('Token não encontrado no localStorage após login');
  return token;
}

test.describe('Financiamentos (E2E - API real)', () => {
  test('criar + editar + detalhes + excluir', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.financiamentos+${timestamp}@example.com`;
    const password = 'Teste@123';

    // Register
    await page.goto('/');
    await page.getByRole('button', { name: 'Não tem uma conta? Registre-se aqui' }).click();
    const registerDialog = page.getByRole('dialog');
    await expect(registerDialog).toBeVisible({ timeout: 15000 });
    await registerDialog.getByPlaceholder('Seu nome').fill(name);
    await registerDialog.getByPlaceholder('Seu email').fill(email);
    await registerDialog.getByPlaceholder('Sua senha').fill(password);
    await registerDialog.getByRole('button', { name: 'Registrar' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Registro bem-sucedido' })).toBeVisible({ timeout: 20000 });

    // Login
    await page.getByPlaceholder('Seu email').first().fill(email);
    await page.getByPlaceholder('Sua senha').first().fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/home', { timeout: 20000 });

    await getAuthToken(page);

    // Go to Financiamentos
    await page.goto('/financiamentos');
    await expect(page.getByRole('heading', { name: 'Financiamentos' })).toBeVisible({ timeout: 20000 });

    const descricao = `Financiamento UI Real ${timestamp}`;

    // Create
    await page.getByRole('button', { name: 'Novo Financiamento' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Novo Financiamento' });
    await expect(dialog).toBeVisible({ timeout: 15000 });

    await dialog.getByLabel('Descrição').fill(descricao);
    await dialog.getByLabel('Valor Total').fill('1000');
    await dialog.getByLabel('Taxa de Juros (%)').fill('2');
    await dialog.getByLabel('Parcelas Totais').fill('10');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    await dialog.getByLabel('Data de Início').fill(iso);

    const postRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'POST' && resp.url().includes('/api/financiamentos') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await dialog.getByRole('button', { name: 'Adicionar Financiamento' }).click();
    await postRespPromise;
    await expect(dialog).toBeHidden({ timeout: 20000 });
    await expect(page.getByRole('alert').filter({ hasText: 'Financiamento adicionado com sucesso' })).toBeVisible({ timeout: 20000 });

    const table = page.getByRole('table');
    await expect(table.getByRole('cell', { name: descricao }).first()).toBeVisible({ timeout: 20000 });

    // Edit
    const row = table.getByRole('row', { name: new RegExp(descricao) }).first();
    const descricaoEdit = `${descricao} Edit`;

    await row.getByLabel(new RegExp(`editar financiamento ${descricao}`)).click();
    await expect(row.locator('input[name="descricao"]')).toBeVisible({ timeout: 15000 });
    await row.locator('input[name="descricao"]').fill(descricaoEdit);
    await row.locator('input[name="taxa_juros"]').fill('3');

    const patchRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'PATCH' && resp.url().includes('/api/financiamentos/') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await row.getByLabel(new RegExp(`salvar financiamento ${descricaoEdit}`)).click();
    await patchRespPromise;

    await expect(table.getByRole('cell', { name: descricaoEdit }).first()).toBeVisible({ timeout: 20000 });

    const editedRow = table.getByRole('row', { name: new RegExp(descricaoEdit) }).first();

    // Details
    await editedRow.getByLabel(new RegExp(`detalhes financiamento ${descricaoEdit}`)).click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes do Financiamento' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText(descricaoEdit)).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Delete
    page.on('dialog', async (d) => {
      if (d.type() === 'confirm') await d.accept();
      else await d.dismiss();
    });

    await editedRow.getByLabel(new RegExp(`excluir financiamento ${descricaoEdit}`)).click();
    await expect(table.getByRole('cell', { name: descricaoEdit })).toHaveCount(0, { timeout: 20000 });
  });
});
