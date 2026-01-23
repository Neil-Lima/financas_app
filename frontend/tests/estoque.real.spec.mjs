import { test, expect } from '@playwright/test';

async function getAuthToken(page) {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) throw new Error('Token não encontrado no localStorage após login');
  return token;
}

async function apiJson(page, { method, url, token, data }) {
  const resp = await page.request.fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data ? JSON.stringify(data) : undefined,
  });

  const contentType = resp.headers()['content-type'] || '';
  const bodyText = await resp.text();
  let body;
  if (contentType.includes('application/json')) {
    try {
      body = JSON.parse(bodyText);
    } catch {
      body = bodyText;
    }
  } else {
    body = bodyText;
  }

  return { resp, body };
}

async function selectMUIOptionByText({ page, combobox, optionText }) {
  await combobox.click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible({ timeout: 15000 });
  await listbox.getByText(optionText, { exact: true }).click();
  await expect(listbox).toBeHidden({ timeout: 15000 });
}

test.describe('Estoque (E2E - API real)', () => {
  test('criar + editar + detalhes + excluir', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.estoque+${timestamp}@example.com`;
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

    const token = await getAuthToken(page);

    // Seed categoria via API real (é listada na tela e usada no select)
    const createdCategoriaIds = [];
    const { body: categoria } = await apiJson(page, {
      method: 'POST',
      url: 'http://localhost:5000/api/categorias',
      token,
      data: { nome: `Categoria Estoque ${timestamp}`, tipo: 'despesa' },
    });
    if (categoria?._id) createdCategoriaIds.push(categoria._id);

    // Go to Estoque
    await page.goto('/estoque');
    await expect(page.getByRole('heading', { name: 'Estoque' })).toBeVisible({ timeout: 20000 });

    const produtoNome = `Produto UI Real ${timestamp}`;

    // Create
    await page.getByRole('button', { name: 'Novo Produto' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Novo Produto' });
    await expect(dialog).toBeVisible({ timeout: 15000 });

    await dialog.getByLabel('Nome').fill(produtoNome);
    await dialog.getByLabel('Quantidade').fill('10');
    await dialog.getByLabel('Preço').fill('5');
    await dialog.getByLabel('Fornecedor').fill(`Fornecedor ${timestamp}`);

    await selectMUIOptionByText({ page, combobox: dialog.getByLabel('Categoria'), optionText: categoria.nome });

    const postRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'POST' && resp.url().includes('/api/estoque') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await dialog.getByRole('button', { name: 'Adicionar Produto' }).click();
    await postRespPromise;
    await expect(dialog).toBeHidden({ timeout: 20000 });
    await expect(page.getByRole('alert').filter({ hasText: 'Produto adicionado com sucesso' })).toBeVisible({ timeout: 20000 });

    const table = page.getByRole('table');
    await expect(table.getByRole('cell', { name: produtoNome }).first()).toBeVisible({ timeout: 20000 });

    // Edit
    const row = table.getByRole('row', { name: new RegExp(produtoNome) }).first();
    const produtoNomeEdit = `${produtoNome} Edit`;

    await row.getByLabel(new RegExp(`editar produto ${produtoNome}`)).click();
    await expect(row.locator('input[name="nome"]')).toBeVisible({ timeout: 15000 });
    await row.locator('input[name="nome"]').fill(produtoNomeEdit);
    await row.locator('input[name="quantidade"]').fill('99');

    const patchRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'PATCH' && resp.url().includes('/api/estoque/') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await row.getByLabel(new RegExp(`salvar produto ${produtoNomeEdit}`)).click();
    await patchRespPromise;

    await expect(table.getByRole('cell', { name: produtoNomeEdit }).first()).toBeVisible({ timeout: 20000 });

    const editedRow = table.getByRole('row', { name: new RegExp(produtoNomeEdit) }).first();

    // Details
    await editedRow.getByLabel(new RegExp(`detalhes produto ${produtoNomeEdit}`)).click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes do Produto' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText(produtoNomeEdit)).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Delete
    page.on('dialog', async (d) => {
      if (d.type() === 'confirm') await d.accept();
      else await d.dismiss();
    });

    await editedRow.getByLabel(new RegExp(`excluir produto ${produtoNomeEdit}`)).click();
    await expect(table.getByRole('cell', { name: produtoNomeEdit })).toHaveCount(0, { timeout: 20000 });

    // Cleanup categoria (best-effort)
    for (const id of createdCategoriaIds) {
      try {
        await page.request.fetch(`http://localhost:5000/api/categorias/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // ignore
      }
    }
  });
});
