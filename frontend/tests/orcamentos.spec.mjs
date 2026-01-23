import { test, expect } from '@playwright/test';

function makeMongoLikeId(n) {
  const hex = n.toString(16);
  return hex.padStart(24, '0').slice(-24);
}

function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

test.describe('Orçamentos (E2E - mock API)', () => {
  test('cadastrar + instruções + comparar anual + editar + detalhes + excluir', async ({ page }) => {
    test.setTimeout(240000);

    page.on('request', (req) => {
      if (req.url().includes('comparar-anual')) {
        console.log('[orcamentos.spec] request comparar-anual', req.method(), req.url());
      }
    });

    page.on('response', (resp) => {
      if (resp.url().includes('comparar-anual')) {
        console.log('[orcamentos.spec] response comparar-anual', resp.status(), resp.request().method(), resp.url());
      }
    });

    // health
    await page.route('**/api/health', async (route) => route.fulfill({ status: 200, body: '' }));

    // auth
    const user = { id: 'u1', nome: 'Usuário Teste', email: 'teste@example.com' };
    const token = 'token-teste';

    await page.route('**/api/usuarios/register', async (route) => {
      const payload = parseJsonSafely(route.request().postData() || '') || {};
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, usuario: { ...user, nome: payload?.nome || user.nome, email: payload?.email || user.email } }),
      });
    });

    await page.route('**/api/usuarios/login', async (route) => {
      const payload = parseJsonSafely(route.request().postData() || '') || {};
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token, usuario: { ...user, email: payload?.email || user.email } }),
      });
    });

    const categorias = [
      { _id: makeMongoLikeId(1), nome: 'Categoria 1' },
      { _id: makeMongoLikeId(2), nome: 'Categoria 2' },
    ];

    const anoAtual = new Date().getFullYear();

    const orcamentos = [
      {
        _id: makeMongoLikeId(10),
        categoria: categorias[0]._id,
        valor_planejado: 100,
        valor_atual: 50,
        valor_restante: 50,
        mes: 1,
        ano: anoAtual,
        notas: 'Inicial',
        recorrencia: 'mensal',
        prioridade: 3,
        metaEconomia: 0,
      },
    ];

    const fulfillJson = (route, status, body) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    await page.route('**/categorias', async (route) => {
      if (route.request().resourceType() === 'document') return route.fallback();
      if (route.request().method() === 'GET') return fulfillJson(route, 200, categorias);
      return fulfillJson(route, 405, { error: 'Method Not Allowed' });
    });

    await page.route('**/api/categorias', async (route) => {
      if (route.request().resourceType() === 'document') return route.fallback();
      if (route.request().method() === 'GET') return fulfillJson(route, 200, categorias);
      return fulfillJson(route, 405, { error: 'Method Not Allowed' });
    });

    const fulfillComparacao = async (route) => {
      if (route.request().resourceType() === 'document') return route.fallback();
      // Alguns ambientes disparam preflight OPTIONS mesmo em same-origin.
      if (route.request().method() === 'OPTIONS') return fulfillJson(route, 204, {});
      if (route.request().method() !== 'GET') return fulfillJson(route, 405, { error: 'Method Not Allowed' });
      console.log('[orcamentos.spec] mock comparar-anual HIT', route.request().method(), route.request().url());
      return fulfillJson(route, 200, {
        'Categoria 1': { anterior: 80, atual: 100 },
        'Categoria 2': { anterior: 50, atual: 40 },
      });
    };

    await page.route('**/orcamentos/comparar-anual**', fulfillComparacao);
    await page.route('**/api/orcamentos/comparar-anual**', fulfillComparacao);

    const handleOrcamentosCollection = async (route) => {
      if (route.request().resourceType() === 'document') return route.fallback();
      const req = route.request();
      const url = new URL(req.url());

      // Alguns patterns amplos (ex.: '**/orcamentos**') podem capturar o endpoint de comparação.
      // Se isso acontecer, respondemos aqui mesmo para evitar bater na rede.
      if (url.pathname.includes('/orcamentos/comparar-anual')) return fulfillComparacao(route);

      if (req.method() === 'GET') {
        const ano = Number(url.searchParams.get('ano') || anoAtual);
        const filtered = orcamentos.filter((o) => Number(o.ano) === Number(ano));
        return fulfillJson(route, 200, filtered);
      }

      if (req.method() === 'POST') {
        const payload = parseJsonSafely(req.postData() || '') || {};
        const created = { _id: makeMongoLikeId(Date.now()), ...payload };
        orcamentos.unshift(created);
        return fulfillJson(route, 200, created);
      }

      return fulfillJson(route, 405, { error: 'Method Not Allowed' });
    };

    await page.route('**/orcamentos**', handleOrcamentosCollection);
    await page.route('**/api/orcamentos**', handleOrcamentosCollection);

    const handleOrcamentosItem = async (route) => {
      if (route.request().resourceType() === 'document') return route.fallback();
      const req = route.request();
      const url = new URL(req.url());

      // Evita que a rota genérica /orcamentos/* responda 405 para o endpoint específico de comparação.
      if (url.pathname.includes('/orcamentos/comparar-anual')) return fulfillComparacao(route);

      const parts = url.pathname.split('/').filter(Boolean);
      const id = parts[parts.length - 1];

      if (req.method() === 'PATCH') {
        const payload = parseJsonSafely(req.postData() || '') || {};
        const idx = orcamentos.findIndex((o) => String(o._id) === String(id));
        if (idx >= 0) orcamentos[idx] = { ...orcamentos[idx], ...payload };
        return fulfillJson(route, 200, idx >= 0 ? orcamentos[idx] : null);
      }

      if (req.method() === 'DELETE') {
        const idx = orcamentos.findIndex((o) => String(o._id) === String(id));
        if (idx >= 0) orcamentos.splice(idx, 1);
        return fulfillJson(route, 200, { ok: true });
      }

      return fulfillJson(route, 405, { error: 'Method Not Allowed' });
    };

    await page.route('**/orcamentos/*', handleOrcamentosItem);
    await page.route('**/api/orcamentos/*', handleOrcamentosItem);

    // ----------------- UI FLOW (register + login) -----------------
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: 'Não tem uma conta? Registre-se aqui' }).click();
    const registerDialog = page.getByRole('dialog');
    await expect(registerDialog).toBeVisible({ timeout: 15000 });
    await registerDialog.getByPlaceholder('Seu nome').fill('Usuário Teste');
    await registerDialog.getByPlaceholder('Seu email').fill('teste@example.com');
    await registerDialog.getByPlaceholder('Sua senha').fill('Teste@123');
    await registerDialog.getByRole('button', { name: 'Registrar' }).click();
    await registerDialog.waitFor({ state: 'hidden', timeout: 15000 });

    await page.getByPlaceholder('Seu email').first().fill('teste@example.com');
    await page.getByPlaceholder('Sua senha').first().fill('Teste@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/home', { timeout: 15000 });

    // ----------------- Orçamentos -----------------
    await page.goto('/orcamentos');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Orçamentos' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Lista de Orçamentos')).toBeVisible();

    // Instruções
    await page.getByRole('button', { name: 'Instruções' }).click();
    const instructionsDialog = page.getByRole('dialog').filter({ hasText: 'Instruções' });
    await expect(instructionsDialog).toBeVisible({ timeout: 15000 });
    await expect(instructionsDialog.getByText('Como usar a página de Orçamentos:')).toBeVisible();
    await instructionsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(instructionsDialog).toBeHidden({ timeout: 15000 });

    // Comparar com Ano Anterior
    const comparacaoReq = page.waitForRequest(
      (req) => req.url().includes('comparar-anual') && req.method() === 'GET',
      { timeout: 15000 }
    );
    const comparacaoResp = page.waitForResponse(
      (resp) => resp.url().includes('comparar-anual') && resp.request().method() === 'GET',
      { timeout: 15000 }
    );
    await page.getByRole('button', { name: 'Comparar com Ano Anterior' }).click();
    await comparacaoReq;
    const resp = await comparacaoResp;
    expect(resp.status()).toBe(200);
    await expect(page.getByText('Comparação Anual')).toBeVisible({ timeout: 15000 });
    const comparacaoCard = page
      .locator('text=Comparação Anual')
      .first()
      .locator('xpath=ancestor::div[contains(@class,"MuiCard-root")][1]');
    await expect(comparacaoCard.getByRole('cell', { name: 'Categoria 1' }).first()).toBeVisible({ timeout: 15000 });

    // Criar orçamento
    await page.getByRole('button', { name: 'Novo Orçamento' }).click();
    const createDialog = page.getByRole('dialog').filter({ hasText: 'Novo Orçamento' });
    await expect(createDialog).toBeVisible({ timeout: 15000 });

    // Categoria (MUI Select/Portal)
    const categoriaCombobox = createDialog.getByRole('combobox', { name: /categoria/i });
    if ((await categoriaCombobox.count()) > 0) {
      await categoriaCombobox.first().click();
    } else {
      // Fallback: alguns temas não expõem combobox com name; o label ainda funciona.
      await createDialog.getByLabel('Categoria').click();
    }
    // MUI Select abre o menu em um Portal (fora do Dialog), então o listbox deve ser buscado no page.
    const categoriaListbox = page.getByRole('listbox');
    await expect(categoriaListbox).toBeVisible({ timeout: 15000 });
    // Alguns temas/MUI podem usar role=option ou role=menuitem; usamos texto como fallback.
    const categoria2Option = categoriaListbox.getByRole('option', { name: 'Categoria 2' });
    if ((await categoria2Option.count()) > 0) {
      await categoria2Option.first().click();
    } else {
      await categoriaListbox.getByText('Categoria 2').click();
    }
    await expect(categoriaListbox).toBeHidden({ timeout: 15000 });
    // Validamos pelo valor do input (source of truth do form), não pelo texto renderizado.
    await expect(createDialog.locator('input[name="categoria"]')).toHaveValue(categorias[1]._id, { timeout: 15000 });

    await createDialog.getByLabel('Valor Planejado').fill('200');
    await createDialog.getByLabel('Mês').fill('2');
    await createDialog.getByLabel('Ano').fill(String(anoAtual));
    await createDialog.getByLabel('Notas').fill('Criado pelo teste');

    await createDialog.getByLabel('Recorrência').click();
    const recorrenciaListbox = page.getByRole('listbox');
    await expect(recorrenciaListbox).toBeVisible({ timeout: 15000 });
    await recorrenciaListbox.getByRole('option', { name: 'Mensal' }).click();
    await expect(recorrenciaListbox).toBeHidden({ timeout: 15000 });

    await createDialog.getByLabel('Prioridade').fill('4');
    await createDialog.getByLabel('Meta de Economia').fill('10');

    const createResp = page.waitForResponse(
      (resp) => resp.request().method() === 'POST' && resp.url().includes('/orcamentos') && resp.status() === 200,
      { timeout: 15000 }
    );
    await createDialog.getByRole('button', { name: 'Adicionar Orçamento' }).click();
    await createResp;

    // O modal não fecha automaticamente no código atual; fechamos explicitamente para prosseguir.
    await createDialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(createDialog).toBeHidden({ timeout: 15000 });

    // Deve aparecer na tabela de "Lista de Orçamentos" (evita conflito com a tabela de comparação)
    const listaCard = page
      .locator('text=Lista de Orçamentos')
      .first()
      .locator('xpath=ancestor::div[contains(@class,"MuiCard-root")][1]');
    await expect(listaCard.getByRole('cell', { name: 'Categoria 2' }).first()).toBeVisible({ timeout: 15000 });

    // Editar (inline) -> salvar
    await page.getByLabel(/editar orcamento/i).first().click();
    // Campo editável
    const plannedEdit = page.locator('input[name="valor_planejado"]').first();
    await expect(plannedEdit).toBeVisible({ timeout: 15000 });
    await plannedEdit.fill('123');

    await page.getByLabel(/salvar orcamento/i).first().click();
    await expect(page.getByText('R$ 123.00')).toBeVisible({ timeout: 15000 });

    // Detalhes
    await page.getByLabel(/detalhes orcamento/i).first().click();
    const detailsDialog = page.getByRole('dialog').filter({ hasText: 'Detalhes do Orçamento' });
    await expect(detailsDialog).toBeVisible({ timeout: 15000 });
    await expect(detailsDialog.getByText('Categoria:')).toBeVisible();
    await detailsDialog.getByRole('button', { name: 'Fechar' }).click();
    await expect(detailsDialog).toBeHidden({ timeout: 15000 });

    // Excluir (confirm)
    page.on('dialog', async (dialog) => {
      if (dialog.type() === 'confirm') await dialog.accept();
      else await dialog.dismiss();
    });

    const rowToDelete = page.getByText('Categoria 2').first();
    await expect(rowToDelete).toBeVisible();

    // tenta clicar no botão da mesma linha; se não achar, usa o primeiro.
    const row = rowToDelete.locator('xpath=ancestor::tr[1]');
    const deleteInRow = row.getByLabel(/excluir orcamento/i);

    if ((await deleteInRow.count()) > 0) {
      await deleteInRow.first().click();
    } else {
      await page.getByLabel(/excluir orcamento/i).first().click();
    }

    // Confirma remoção apenas na tabela "Lista de Orçamentos" (evita conflito com a tabela de comparação)
    await expect(listaCard.getByRole('cell', { name: 'Categoria 2' })).toHaveCount(0, { timeout: 15000 });
  });
});
