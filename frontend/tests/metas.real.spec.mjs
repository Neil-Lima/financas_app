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

async function selectMUIOptionByLabel({ page, scope, label, optionText }) {
  const field = scope.getByLabel(label);
  await field.click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible({ timeout: 15000 });
  await listbox.getByText(optionText, { exact: true }).click();
  await expect(listbox).toBeHidden({ timeout: 15000 });
}

test.describe('Metas (E2E - API real)', () => {
  test('criar + editar + detalhes + excluir', async ({ page }) => {
    test.setTimeout(240000);

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real.metas+${timestamp}@example.com`;
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

    // Go to Metas
    await page.goto('/metas');
    await expect(page.getByRole('heading', { name: 'Metas' })).toBeVisible({ timeout: 20000 });

    const descricao = `Meta UI Real ${timestamp}`;

    // Create
    await page.getByRole('button', { name: 'Nova Meta' }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'Nova Meta' });
    await expect(dialog).toBeVisible({ timeout: 15000 });

    await dialog.getByLabel('Descrição').fill(descricao);
    await dialog.getByLabel('Valor Alvo').fill('100');
    await dialog.getByLabel('Valor Atual').fill('10');

    const today = new Date();
    const limit = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const yyyy = limit.getFullYear();
    const mm = String(limit.getMonth() + 1).padStart(2, '0');
    const dd = String(limit.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    await dialog.getByLabel('Data Limite').fill(iso);

    await selectMUIOptionByLabel({ page, scope: dialog, label: 'Categoria', optionText: 'Financeira' });

    const postRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'POST' && resp.url().includes('/api/metas') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await dialog.getByRole('button', { name: 'Adicionar Meta' }).click();
    await postRespPromise;
    await expect(dialog).toBeHidden({ timeout: 20000 });
    await expect(page.getByRole('alert').filter({ hasText: 'Meta adicionada com sucesso' })).toBeVisible({ timeout: 20000 });

    const table = page.getByRole('table');
    await expect(table.getByRole('cell', { name: descricao }).first()).toBeVisible({ timeout: 20000 });

    // Edit
    const row = table.getByRole('row', { name: new RegExp(descricao) }).first();
    const descricaoEdit = `${descricao} Edit`;

    await row.getByLabel(new RegExp(`editar meta ${descricao}`)).click();
    await expect(row.locator('input[name="descricao"]')).toBeVisible({ timeout: 15000 });
    await row.locator('input[name="descricao"]').fill(descricaoEdit);
    await row.locator('input[name="valor_atual"]').fill('25');

    const patchRespPromise = page.waitForResponse(
      (resp) => resp.request().method() === 'PATCH' && resp.url().includes('/api/metas/') && resp.status() >= 200 && resp.status() < 300,
      { timeout: 30000 }
    );
    await row.getByLabel(new RegExp(`salvar meta ${descricaoEdit}`)).click();
    await patchRespPromise;

    await expect(table.getByRole('cell', { name: descricaoEdit }).first()).toBeVisible({ timeout: 20000 });

    const editedRow = table.getByRole('row', { name: new RegExp(descricaoEdit) }).first();

    // Details
    await editedRow.getByLabel(new RegExp(`detalhes meta ${descricaoEdit}`)).click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes da Meta' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText(descricaoEdit)).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Delete
    page.on('dialog', async (d) => {
      if (d.type() === 'confirm') await d.accept();
      else await d.dismiss();
    });

    await editedRow.getByLabel(new RegExp(`excluir meta ${descricaoEdit}`)).click();
    await expect(table.getByRole('cell', { name: descricaoEdit })).toHaveCount(0, { timeout: 20000 });

    // Cleanup best-effort: remove metas criadas (se a UI não conseguiu)
    try {
      const { body: metas } = await apiJson(page, {
        method: 'GET',
        url: 'http://localhost:5000/api/metas',
        token,
      });

      const candidates = (Array.isArray(metas) ? metas : []).filter((m) => String(m?.descricao || '').includes(String(timestamp)));
      for (const m of candidates) {
        if (!m?._id) continue;
        await page.request.fetch(`http://localhost:5000/api/metas/${m._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore
    }
  });
});
