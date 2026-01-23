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

async function selectCategoriaByName({ page, scope, fieldLabel, optionText }) {
  const field = scope.getByLabel(fieldLabel);
  const tagName = await field.evaluate((el) => el.tagName.toLowerCase());
  if (tagName === 'select') {
    await field.selectOption({ label: optionText });
    return;
  }

  // MUI Select => role=combobox + portal listbox
  await field.click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible({ timeout: 15000 });
  await listbox.getByText(optionText, { exact: true }).click();
  await expect(listbox).toBeHidden({ timeout: 15000 });
}

test.describe('Despesas (E2E - API real)', () => {
  test('criar + editar + detalhes + excluir', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.despesas+${timestamp}@example.com`;
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

    // Seed: categoria despesa
    const createdCategoriaIds = [];
    const categoriaNome = `Categoria Despesa ${timestamp}`;
    const { resp: catResp, body: categoria } = await apiJson(page, {
      method: 'POST',
      url: 'http://localhost:5000/api/categorias',
      token,
      data: { nome: categoriaNome, tipo: 'despesa' },
    });
    expect(catResp.status(), JSON.stringify(categoria)).toBeGreaterThanOrEqual(200);
    expect(catResp.status(), JSON.stringify(categoria)).toBeLessThan(300);
    if (categoria?._id) createdCategoriaIds.push(categoria._id);

    // Go to Despesas
    await page.goto('/despesas');
    await expect(page.getByRole('heading', { name: 'Despesas' })).toBeVisible({ timeout: 20000 });

    const descricao = `Despesa UI Real ${timestamp}`;

    // Create via UI
    await page.getByRole('button', { name: 'Nova Despesa' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Nova Despesa' });
    await expect(dialog).toBeVisible({ timeout: 15000 });

    await dialog.getByLabel('Descrição').fill(descricao);
    await dialog.getByLabel('Valor').fill('10');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    await dialog.getByLabel('Data').fill(iso);

    await selectCategoriaByName({ page, scope: dialog, fieldLabel: 'Categoria', optionText: categoriaNome });

    const postRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'POST' && resp.url().includes('/despesas') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await dialog.getByRole('button', { name: 'Adicionar Despesa' }).click();
    await postRespPromise;
    await expect(dialog).toBeHidden({ timeout: 20000 });

    await expect(page.getByRole('alert').filter({ hasText: 'Despesa adicionada com sucesso' })).toBeVisible({ timeout: 20000 });

    const table = page.getByRole('table');
    await expect(table.getByRole('cell', { name: descricao }).first()).toBeVisible({ timeout: 20000 });

    // Edit
    const row = table.getByRole('row', { name: new RegExp(descricao) }).first();
    await row.getByLabel(new RegExp(`editar despesa ${descricao}`)).click();

    await expect(row.locator('input[name="descricao"]')).toBeVisible({ timeout: 15000 });
    const descricaoEdit = `${descricao} Edit`;
    await row.locator('input[name="descricao"]').fill(descricaoEdit);
    await row.locator('input[name="valor"]').fill('123');

    // Categoria em edição (select dentro da tabela)
    const editCategoriaCell = row.getByRole('cell').nth(3);
    const editCategoriaCombo = editCategoriaCell.getByRole('combobox');
    if ((await editCategoriaCombo.count()) > 0) {
      await editCategoriaCombo.click();
      const listbox2 = page.getByRole('listbox');
      await expect(listbox2).toBeVisible({ timeout: 15000 });
      await listbox2.getByText(categoriaNome).click();
      await expect(listbox2).toBeHidden({ timeout: 15000 });
    }

    const patchRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'PATCH' && resp.url().includes('/despesas/') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await row.getByLabel(/salvar despesa/i).click();
    await patchRespPromise;

    await expect(table.getByRole('cell', { name: descricaoEdit }).first()).toBeVisible({ timeout: 20000 });

    const editedRow = table.getByRole('row', { name: new RegExp(descricaoEdit) }).first();

    // Details
    await editedRow.getByLabel(new RegExp(`detalhes despesa ${descricaoEdit}`)).click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes da Despesa' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText(descricaoEdit)).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Delete
    page.on('dialog', async (d) => {
      if (d.type() === 'confirm') await d.accept();
      else await d.dismiss();
    });

    await editedRow.getByLabel(new RegExp(`excluir despesa ${descricaoEdit}`)).click();
    await expect(table.getByRole('cell', { name: descricaoEdit })).toHaveCount(0, { timeout: 20000 });

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
