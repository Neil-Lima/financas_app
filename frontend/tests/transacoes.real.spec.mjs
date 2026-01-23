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

test.describe('Transações (E2E - API real)', () => {
  test('criar + editar + detalhes + excluir', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.transacoes+${timestamp}@example.com`;
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

    // Seed deps via API real: categoria + conta
    const createdCategoriaIds = [];
    const createdContaIds = [];

    const { body: categoria } = await apiJson(page, {
      method: 'POST',
      url: 'http://localhost:5000/api/categorias',
      token,
      data: { nome: `Categoria Transacao ${timestamp}`, tipo: 'despesa' },
    });
    if (categoria?._id) createdCategoriaIds.push(categoria._id);

    const { body: conta } = await apiJson(page, {
      method: 'POST',
      url: 'http://localhost:5000/api/contas',
      token,
      data: {
        nome: `Conta Transacao ${timestamp}`,
        saldo: 0,
        tipo: 'corrente',
        data: new Date().toISOString(),
      },
    });
    if (conta?._id) createdContaIds.push(conta._id);

    // Go to Transações
    await page.goto('/transacoes');
    await expect(page.getByRole('heading', { name: 'Transações' })).toBeVisible({ timeout: 20000 });

    const descricao = `Transacao UI Real ${timestamp}`;

    // Create via UI (form na própria página)
    await page.getByRole('combobox', { name: 'Conta' }).click();
    const contaListbox = page.getByRole('listbox');
    await expect(contaListbox).toBeVisible({ timeout: 15000 });
    await contaListbox.getByText(conta.nome).click();
    await expect(contaListbox).toBeHidden({ timeout: 15000 });

    await page.getByRole('combobox', { name: 'Categoria' }).click();
    const categoriaListbox = page.getByRole('listbox');
    await expect(categoriaListbox).toBeVisible({ timeout: 15000 });
    await categoriaListbox.getByText(categoria.nome).click();
    await expect(categoriaListbox).toBeHidden({ timeout: 15000 });
    await page.getByLabel('Descrição').fill(descricao);
    await page.getByLabel('Valor').fill('10');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    await page.getByLabel('Data').fill(iso);

    await page.getByRole('combobox', { name: 'Tipo' }).click();
    const tipoListbox = page.getByRole('listbox');
    await expect(tipoListbox).toBeVisible({ timeout: 15000 });
    await tipoListbox.getByText('Despesa').click();
    await expect(tipoListbox).toBeHidden({ timeout: 15000 });

    await page.getByRole('button', { name: 'Adicionar Transação' }).click();

    const table = page.getByRole('table');
    await expect(table.getByRole('cell', { name: descricao }).first()).toBeVisible({ timeout: 20000 });

    const row = table.getByRole('row', { name: new RegExp(descricao) }).first();
    const descricaoEdit = `${descricao} Edit`;

    // Edit
    await row.getByLabel(new RegExp(`editar transacao ${descricao}`)).click();

    await row.locator('input[name="descricao"]').fill(descricaoEdit);
    await row.locator('input[name="valor"]').fill('123');

    // Tipo em modo edição
    // Não depende de label (MUI Select dentro da tabela pode ficar sem nome acessível)
    const tipoCell = row.getByRole('cell').nth(5);
    await tipoCell.getByRole('combobox').click();
    const editTipoListbox = page.getByRole('listbox');
    await expect(editTipoListbox).toBeVisible({ timeout: 15000 });
    await editTipoListbox.getByText('Receita').click();
    await expect(editTipoListbox).toBeHidden({ timeout: 15000 });

    const patchRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'PATCH' && resp.url().includes('/transacoes/') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await row.getByLabel(/salvar transacao/i).click();
    await patchRespPromise;

    await expect(table.getByRole('cell', { name: descricaoEdit }).first()).toBeVisible({ timeout: 20000 });

    const editedRow = table.getByRole('row', { name: new RegExp(descricaoEdit) }).first();

    // Details
    await editedRow.getByLabel(new RegExp(`detalhes transacao ${descricaoEdit}`)).click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes da Transação' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText(descricaoEdit)).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Delete
    page.on('dialog', async (d) => {
      if (d.type() === 'confirm') await d.accept();
      else await d.dismiss();
    });

    await editedRow.getByLabel(new RegExp(`excluir transacao ${descricaoEdit}`)).click();
    await expect(table.getByRole('cell', { name: descricaoEdit })).toHaveCount(0, { timeout: 20000 });

    // Cleanup (best-effort)
    for (const id of createdContaIds) {
      try {
        await page.request.fetch(`http://localhost:5000/api/contas/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // ignore
      }
    }

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
