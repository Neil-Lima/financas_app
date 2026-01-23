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

test.describe('Orçamentos (E2E - API real)', () => {
  test('fluxo completo usando backend real (CRUD + comparar anual + detalhes)', async ({ page }) => {
    test.setTimeout(240000);

    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('/orcamentos')) {
        console.log('[orcamentos.real] request', req.method(), url);
      }
    });

    page.on('response', (resp) => {
      const url = resp.url();
      if (url.includes('/orcamentos')) {
        console.log('[orcamentos.real] response', resp.status(), resp.request().method(), url);
      }
    });

    const timestamp = Date.now();
    const name = `E2E Real ${timestamp}`;
    const email = `e2e.real+${timestamp}@example.com`;
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

    // Create categorias via API real (garante opções no select)
    const createdCategoriaIds = [];
    const createCategoria = async (nome, tipo) => {
      const { resp, body } = await apiJson(page, {
        method: 'POST',
        url: 'http://localhost:5000/api/categorias',
        token,
        data: { nome, tipo },
      });
      expect(resp.status(), JSON.stringify(body)).toBeGreaterThanOrEqual(200);
      expect(resp.status(), JSON.stringify(body)).toBeLessThan(300);
      const id = body?._id;
      if (id) createdCategoriaIds.push(id);
      return body;
    };

    const categoria1 = await createCategoria(`Categoria E2E 1 ${timestamp}`, 'despesa');
    const categoria2 = await createCategoria(`Categoria E2E 2 ${timestamp}`, 'despesa');

    // Go to orcamentos
    await page.goto('/orcamentos');
    await expect(page.getByRole('heading', { name: 'Orçamentos' })).toBeVisible({ timeout: 20000 });

    // Comparar anual (API real)
    await page.getByRole('button', { name: 'Comparar com Ano Anterior' }).click();
    await expect(page.getByText('Comparação Anual')).toBeVisible({ timeout: 20000 });

    // Create orcamento via UI
    await page.getByRole('button', { name: 'Novo Orçamento' }).click();
    const createDialog = page.getByRole('dialog').filter({ hasText: 'Novo Orçamento' });
    await expect(createDialog).toBeVisible({ timeout: 15000 });

    // Categoria (MUI Select Portal)
    const categoriaCombobox = createDialog.getByRole('combobox', { name: /categoria/i });
    if ((await categoriaCombobox.count()) > 0) {
      await categoriaCombobox.first().click();
    } else {
      await createDialog.getByLabel('Categoria').click();
    }

    const categoriaListbox = page.getByRole('listbox');
    await expect(categoriaListbox).toBeVisible({ timeout: 15000 });
    // tenta selecionar pelo nome exato criado
    const optionName = categoria2?.nome || `Categoria E2E 2 ${timestamp}`;
    const opt = categoriaListbox.getByRole('option', { name: optionName });
    if ((await opt.count()) > 0) {
      await opt.first().click();
    } else {
      await categoriaListbox.getByText(optionName).click();
    }
    await expect(categoriaListbox).toBeHidden({ timeout: 15000 });

    await createDialog.getByLabel('Valor Planejado').fill('200');
    await createDialog.getByLabel('Mês').fill('2');
    await createDialog.getByLabel('Ano').fill(String(new Date().getFullYear()));
    await createDialog.getByLabel('Notas').fill('Criado pelo E2E (real api)');

    await createDialog.getByLabel('Recorrência').click();
    const recorrenciaListbox = page.getByRole('listbox');
    await expect(recorrenciaListbox).toBeVisible({ timeout: 15000 });
    await recorrenciaListbox.getByText('Mensal').click();
    await expect(recorrenciaListbox).toBeHidden({ timeout: 15000 });

    await createDialog.getByLabel('Prioridade').fill('4');
    await createDialog.getByLabel('Meta de Economia').fill('10');

    // aguarda a lista atualizar (alert pode variar)
    await createDialog.getByRole('button', { name: 'Adicionar Orçamento' }).click();
    await createDialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(createDialog).toBeHidden({ timeout: 15000 });

    const listaCard = page
      .locator('text=Lista de Orçamentos')
      .first()
      .locator('xpath=ancestor::div[contains(@class,"MuiCard-root")][1]');

    await expect(listaCard.getByRole('cell', { name: optionName }).first()).toBeVisible({ timeout: 20000 });

    // Editar (inline) - pega o primeiro item com nosso nome
    const rowToEdit = listaCard.getByRole('row', { name: new RegExp(optionName) }).first();
    await rowToEdit.getByLabel(/editar orcamento/i).click();

    const plannedEdit = rowToEdit.locator('input[name="valor_planejado"]');
    await expect(plannedEdit).toBeVisible({ timeout: 15000 });
    await plannedEdit.fill('123');

    const patchRespPromise = page.waitForResponse(
      (resp) => {
        const method = resp.request().method();
        const url = resp.url();
        return method === 'PATCH' && url.includes('/orcamentos/') && resp.status() >= 200 && resp.status() < 300;
      },
      { timeout: 30000 }
    );
    await rowToEdit.getByLabel(/salvar orcamento/i).click();
    await patchRespPromise;

    // Aguarda a linha sair do modo edição e renderizar o valor formatado.
    await expect(rowToEdit.getByLabel(/editar orcamento/i)).toBeVisible({ timeout: 20000 });
    const plannedCell = rowToEdit.getByRole('cell').nth(1);
    await expect(plannedCell).toHaveText(/R\$\s*123\.00/, { timeout: 20000 });

    // Detalhes
    await rowToEdit.getByLabel(/detalhes orcamento/i).click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes do Orçamento' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText('Categoria:')).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Excluir
    page.on('dialog', async (dialog) => {
      if (dialog.type() === 'confirm') await dialog.accept();
      else await dialog.dismiss();
    });

    await rowToEdit.getByLabel(/excluir orcamento/i).click();
    await expect(listaCard.getByRole('cell', { name: optionName })).toHaveCount(0, { timeout: 20000 });

    // Cleanup categorias (best-effort)
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
