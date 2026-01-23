import { test, expect } from '@playwright/test';

function makeMongoLikeId(seed) {
  const hex = Number(seed).toString(16);
  return hex.padStart(24, '0').slice(-24);
}

function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function ensureDialogClosed(page) {
  const dialog = page.getByRole('dialog');
  if (await dialog.count()) {
    await dialog.first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }
}

async function openDialogByButton(page, buttonName) {
  await page.getByRole('button', { name: buttonName }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible({ timeout: 15000 });
  return dialog;
}

async function closeDialog(page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible({ timeout: 15000 });

  const candidates = [
    page.getByRole('button', { name: 'Cancelar' }),
    page.getByRole('button', { name: 'Fechar' }),
    page.getByRole('button', { name: 'Voltar' }),
  ];

  for (const btn of candidates) {
    if (await btn.count()) {
      await btn.first().click();
      await ensureDialogClosed(page);
      return;
    }
  }

  await page.keyboard.press('Escape');
  await ensureDialogClosed(page);
}

test('journey serial: registra, loga e valida funcionalidades principais de cada página', async ({ page }) => {
  test.setTimeout(360000);

  // ---------------------------------------------------------------------------
  // Mock de infraestrutura (health check) e auth (register/login)
  // ---------------------------------------------------------------------------
  await page.route('**/api/health', async (route) => {
    return route.fulfill({ status: 200, body: '' });
  });

  const user = { id: 'u1', nome: 'Usuário Teste', email: 'teste@example.com' };
  const token = 'token-teste';

  await page.route('**/api/usuarios/register', async (route) => {
    const payload = parseJsonSafely(route.request().postData() || '') || {};
    const nome = payload?.nome || user.nome;
    const email = payload?.email || user.email;
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, usuario: { ...user, nome, email } }),
    });
  });

  await page.route('**/api/usuarios/login', async (route) => {
    const payload = parseJsonSafely(route.request().postData() || '') || {};
    const email = payload?.email || user.email;
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token, usuario: { ...user, email } }),
    });
  });

  // ---------------------------------------------------------------------------
  // Mock genérico para recursos CRUD usados pelas telas
  // (evita que as páginas quebrem por backend ausente)
  // ---------------------------------------------------------------------------
  const stores = {
    categorias: Array.from({ length: 12 }).map((_, i) => ({ _id: makeMongoLikeId(i + 1), nome: `Categoria ${i + 1}` })),
    contas: [{ _id: makeMongoLikeId(101), nome: 'Conta Teste' }],
    transacoes: [],
    despesas: [],
    orcamentos: [],
    parcelamentos: [],
    financiamentos: [],
    produtos: [],
    metas: [],
  };

  const fulfillJson = (route, status, bodyObj) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(bodyObj) });

  await page.route('**/api/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const parts = url.pathname.split('/').filter(Boolean); // [api, resource]
    const resource = parts[1];

    if (!resource) return fulfillJson(route, 404, { error: 'not found' });

    // Deixa o auth acima cuidar.
    if (resource === 'usuarios') return route.fallback();

    if (!(resource in stores)) {
      // Para recursos não mapeados, responde 200 vazio para não quebrar UI.
      if (req.method() === 'GET') return fulfillJson(route, 200, []);
      return fulfillJson(route, 200, { ok: true });
    }

    if (req.method() === 'GET') return fulfillJson(route, 200, stores[resource]);

    if (req.method() === 'POST') {
      const payload = parseJsonSafely(req.postData() || '') || {};
      const created = { _id: makeMongoLikeId(Date.now()), ...payload };
      stores[resource].unshift(created);
      return fulfillJson(route, 200, created);
    }

    return fulfillJson(route, 405, { error: 'method not allowed' });
  });

  await page.route('**/api/*/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const parts = url.pathname.split('/').filter(Boolean); // [api, resource, id]
    const resource = parts[1];
    const id = parts[2];

    if (!resource || !(resource in stores)) {
      return fulfillJson(route, 200, { ok: true });
    }

    if (req.method() === 'PATCH') {
      const payload = parseJsonSafely(req.postData() || '') || {};
      const idx = stores[resource].findIndex((x) => String(x._id) === String(id));
      if (idx >= 0) stores[resource][idx] = { ...stores[resource][idx], ...payload };
      return fulfillJson(route, 200, idx >= 0 ? stores[resource][idx] : null);
    }

    if (req.method() === 'DELETE') {
      const idx = stores[resource].findIndex((x) => String(x._id) === String(id));
      if (idx >= 0) stores[resource].splice(idx, 1);
      return fulfillJson(route, 200, { ok: true });
    }

    return fulfillJson(route, 405, { error: 'method not allowed' });
  });

  // ---------------------------------------------------------------------------
  // Fluxo UI: registrar e logar
  // ---------------------------------------------------------------------------
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('button', { name: 'Não tem uma conta? Registre-se aqui' }).click();
  const registerDialog = page.getByRole('dialog');
  await expect(registerDialog).toBeVisible({ timeout: 15000 });
  await registerDialog.getByPlaceholder('Seu nome').fill('Usuário Teste');
  await registerDialog.getByPlaceholder('Seu email').fill('teste@example.com');
  await registerDialog.getByPlaceholder('Sua senha').fill('Teste@123');
  await registerDialog.getByRole('button', { name: 'Registrar' }).click();
  await ensureDialogClosed(page);

  await page.getByPlaceholder('Seu email').first().fill('teste@example.com');
  await page.getByPlaceholder('Sua senha').first().fill('Teste@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/home', { timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });

  // ---------------------------------------------------------------------------
  // Páginas: visita e valida a ação principal (sem pular etapa)
  // ---------------------------------------------------------------------------
  const steps = [
    {
      path: '/transacoes',
      heading: 'Transações',
      run: async (page) => {
        // Preenche o formulário e submete (não existe botão "Nova Transação")
        await expect(page.getByText('Nova Transação')).toBeVisible({ timeout: 15000 });
        await expect(page.getByRole('button', { name: 'Adicionar Transação' })).toBeVisible({ timeout: 15000 });

        // Conta
        await page.getByLabel('Conta').click();
        await page.getByRole('option', { name: 'Conta Teste' }).click();

        // Categoria
        await page.getByLabel('Categoria').click();
        await page.getByRole('option', { name: 'Categoria 1', exact: true }).click();

        await page.getByLabel('Descrição').fill('Transação Playwright');
        await page.getByLabel('Valor').fill('10');
        await page.getByLabel('Data').fill('2026-01-01');
        await page.getByLabel('Tipo').click();
        await page.getByRole('option', { name: /receita/i }).click();

        await page.getByRole('button', { name: 'Adicionar Transação' }).click();
        await expect(page.getByText('Transação adicionada com sucesso')).toBeVisible({ timeout: 15000 });

        // Editar a transação na tabela
        await expect(page.getByText('Lista de Transações')).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('Transação Playwright')).toBeVisible({ timeout: 15000 });
        await page.getByLabel(/editar transacao Transação Playwright/).click();
        const editingRow = page.locator('tr', { has: page.getByRole('textbox') }).first();
        await editingRow.getByRole('textbox').first().fill('Transação Editada');
        await page.getByLabel(/salvar transacao Transação Editada/).click();
        await expect(page.getByText('Transação atualizada com sucesso')).toBeVisible({ timeout: 15000 });

        // Abrir detalhes
        await page.getByLabel(/detalhes transacao Transação Editada/).click();
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 15000 });
        await page.getByRole('button', { name: 'Fechar' }).click();

        // Deletar (aceita confirm)
        page.once('dialog', async (d) => {
          await d.accept();
        });
        await page.getByLabel(/excluir transacao Transação Editada/).click();
        await expect(page.getByText('Transação excluída com sucesso')).toBeVisible({ timeout: 15000 });
      },
    },
    {
      path: '/categorias',
      heading: 'Categorias',
      actionButton: 'Nova Categoria',
      afterOpen: async (page) => {
        // valida que existe filtro/ordenação
        await expect(page.getByLabel('Filtrar categorias')).toBeVisible({ timeout: 15000 });
        await expect(page.getByLabel('Ordenação')).toBeVisible({ timeout: 15000 });
      },
    },
    {
      path: '/contas',
      heading: 'Contas',
      actionButton: 'Nova Conta',
    },
    {
      path: '/orcamentos',
      heading: 'Orçamentos',
      actionButton: 'Novo Orçamento',
    },
    {
      path: '/despesas',
      heading: 'Despesas',
      actionButton: 'Nova Despesa',
    },
    {
      path: '/contas-a-pagar',
      heading: 'Contas a Pagar',
    },
    {
      path: '/dividas',
      heading: 'Resumo de Dívidas',
    },
    {
      path: '/vencimentos',
      heading: 'Vencimentos',
    },
    {
      path: '/parcelamentos',
      heading: 'Parcelamentos',
      actionButton: 'Novo Parcelamento',
    },
    {
      path: '/financiamentos',
      heading: 'Financiamentos',
      actionButton: 'Novo Financiamento',
    },
    {
      path: '/estoque',
      heading: 'Estoque',
      actionButton: 'Novo Produto',
    },
    {
      path: '/metas',
      heading: 'Metas',
      actionButton: 'Nova Meta',
    },
    {
      path: '/relatorios',
      heading: 'Relatórios',
      actionButton: 'Gerar Relatório',
    },
  ];

  for (const s of steps) {
    await page.goto(s.path);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: s.heading })).toBeVisible({ timeout: 15000 });

    if (s.afterOpen) {
      await s.afterOpen(page);
    }

    if (s.run) {
      await s.run(page);
    }

    if (s.actionButton) {
      await openDialogByButton(page, s.actionButton);
      await closeDialog(page);
    }
  }
});
