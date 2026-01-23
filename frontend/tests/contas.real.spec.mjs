import { test, expect } from '@playwright/test';

async function getAuthToken(page) {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) throw new Error('Token não encontrado no localStorage após login');
  return token;
}

test.describe('Contas (E2E - API real)', () => {
  test('criar + editar + detalhes + excluir', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.contas+${timestamp}@example.com`;
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

    // Go to Contas
    await page.goto('/contas');
    await expect(page.getByRole('heading', { name: 'Contas' })).toBeVisible({ timeout: 20000 });

    const contaNome = `Conta UI Real ${timestamp}`;

    // Create
    await page.getByRole('button', { name: 'Nova Conta' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Nova Conta' });
    await expect(dialog).toBeVisible({ timeout: 15000 });

    await dialog.getByLabel('Nome').fill(contaNome);
    await dialog.getByLabel('Saldo').fill('50');

    await dialog.getByLabel('Tipo').click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 15000 });
    await listbox.getByText('Corrente').click();
    await expect(listbox).toBeHidden({ timeout: 15000 });

    // Data: preenche hoje no formato yyyy-mm-dd
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    await dialog.getByLabel('Data').fill(iso);

    await dialog.getByRole('button', { name: 'Adicionar Conta' }).click();

    const table = page.getByRole('table');
    await expect(table.getByRole('cell', { name: contaNome }).first()).toBeVisible({ timeout: 20000 });

    // Row locator
    const row = table.getByRole('row', { name: new RegExp(contaNome) }).first();

    // Edit
    await row.getByRole('button', { name: 'Editar' }).click().catch(async () => {
      // fallback se não tiver role name no tooltip
      await row.locator('button').nth(0).click();
    });

    await expect(row.locator('input[name="nome"]')).toBeVisible({ timeout: 15000 });
    await row.locator('input[name="nome"]').fill(`${contaNome} Edit`);
    await row.locator('input[name="saldo"]').fill('123');

    await row.getByRole('combobox').first().click();
    const listbox2 = page.getByRole('listbox');
    await expect(listbox2).toBeVisible({ timeout: 15000 });
    await listbox2.getByText('Poupança').click();
    await expect(listbox2).toBeHidden({ timeout: 15000 });

    const patchRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'PATCH' && resp.url().includes('/contas/') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await row.getByRole('button', { name: 'Salvar' }).click().catch(async () => {
      await row.locator('button').first().click();
    });
    await patchRespPromise;

    await expect(table.getByRole('cell', { name: `${contaNome} Edit` }).first()).toBeVisible({ timeout: 20000 });

    // Details
    const detailsBtn = row.locator('button').nth(2);
    await detailsBtn.click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes da Conta' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText('Nome:')).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Delete
    page.on('dialog', async (d) => {
      if (d.type() === 'confirm') await d.accept();
      else await d.dismiss();
    });

    const deleteBtn = row.locator('button').nth(1);
    await deleteBtn.click();
    await expect(table.getByRole('cell', { name: `${contaNome} Edit` })).toHaveCount(0, { timeout: 20000 });
  });
});
