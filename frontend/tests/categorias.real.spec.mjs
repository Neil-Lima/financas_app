import { test, expect } from '@playwright/test';

async function getAuthToken(page) {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) throw new Error('Token não encontrado no localStorage após login');
  return token;
}

test.describe('Categorias (E2E - API real)', () => {
  test('CRUD usando backend real', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.categorias+${timestamp}@example.com`;
    const password = 'Teste@123';

    // Auth via API (mais estável que UI)
    await page.goto('/');

    const registerResp = await page.request.fetch('http://localhost:5000/api/usuarios/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ nome: name, email, senha: password }),
    });
    expect(registerResp.status()).toBeGreaterThanOrEqual(200);
    expect(registerResp.status()).toBeLessThan(300);

    const loginResp = await page.request.fetch('http://localhost:5000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ email, senha: password }),
    });
    expect(loginResp.status()).toBeGreaterThanOrEqual(200);
    expect(loginResp.status()).toBeLessThan(300);
    const loginBody = await loginResp.json();

    await page.evaluate(({ token, userId }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
    }, { token: loginBody.token, userId: loginBody?.usuario?.id });

    await getAuthToken(page);

    // Go to Categorias
    await page.goto('/categorias');
    await expect(page.getByRole('heading', { name: 'Categorias' })).toBeVisible({ timeout: 20000 });

    const categoriaNome = `Categoria UI Real ${timestamp}`;

    // Create
    await page.getByRole('button', { name: 'Nova Categoria' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Nova Categoria' });
    await expect(dialog).toBeVisible({ timeout: 15000 });

    await dialog.getByLabel('Nome').fill(categoriaNome);

    // Tipo (MUI Select Portal)
    await dialog.getByLabel('Tipo').click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 15000 });
    await listbox.getByText('despesa').click();
    await expect(listbox).toBeHidden({ timeout: 15000 });

    await dialog.getByRole('button', { name: 'Salvar' }).click();

    // Assert appears in table (com filtro para não depender de paginação/ordenação)
    await page.getByRole('textbox', { name: 'Filtrar categorias' }).fill(categoriaNome);
    const table = page.getByRole('table');
    await expect(table.getByRole('cell', { name: categoriaNome }).first()).toBeVisible({ timeout: 20000 });

    // Edit (inline)
    await page.getByLabel(`editar categoria ${categoriaNome}`).click();
    const row = table.getByRole('row', { name: new RegExp(categoriaNome) }).first();
    await expect(row.locator('input[name="nome"]')).toBeVisible({ timeout: 15000 });
    await row.locator('input[name="nome"]').fill(`${categoriaNome} Edit`);

    // mudar tipo para receita
    // O MUI Select renderiza um combobox visível + um nativeInput escondido; clique no combobox.
    await row.getByRole('combobox').first().click();
    const listbox2 = page.getByRole('listbox');
    await expect(listbox2).toBeVisible({ timeout: 15000 });
    await listbox2.getByText('receita').click();
    await expect(listbox2).toBeHidden({ timeout: 15000 });

    await row.getByLabel(/salvar categoria/i).click();

    // Reaplica filtro para validar o novo nome
    await page.getByRole('textbox', { name: 'Filtrar categorias' }).fill(`${categoriaNome} Edit`);

    await expect(table.getByRole('cell', { name: `${categoriaNome} Edit` }).first()).toBeVisible({ timeout: 20000 });

    // Delete
    page.on('dialog', async (d) => {
      if (d.type() === 'confirm') await d.accept();
      else await d.dismiss();
    });

    await page.getByLabel(`excluir categoria ${categoriaNome} Edit`).click();
    await expect(table.getByRole('cell', { name: `${categoriaNome} Edit` })).toHaveCount(0, { timeout: 20000 });
  });
});
