import { test, expect } from '@playwright/test';
import { registerAndLogin } from '../src/playwrite/auth.mjs';

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

test.describe('Categorias (E2E - mock API)', () => {
  test('listar + filtro + ordenação + paginação + CRUD', async ({ page }) => {
    test.setTimeout(240000);

    await registerAndLogin(page);

    const store = Array.from({ length: 20 }).map((_, i) => {
      const idx = i + 1;
      return {
        _id: makeMongoLikeId(idx),
        nome: `Categoria ${String(idx).padStart(2, '0')}`,
      };
    });

    await page.route('**/api/categorias', async (route) => {
      const req = route.request();
      const method = req.method();

      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(store),
        });
      }

      if (method === 'POST') {
        const payload = parseJsonSafely(req.postData() || '') || {};
        const nome = String(payload?.nome || '').trim();
        const created = { _id: makeMongoLikeId(Date.now()), nome };
        store.unshift(created);
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(created),
        });
      }

      return route.fulfill({ status: 405, body: 'Method Not Allowed' });
    });

    await page.route('**/api/categorias/*', async (route) => {
      const req = route.request();
      const method = req.method();
      const url = new URL(req.url());
      const parts = url.pathname.split('/').filter(Boolean);
      const id = parts[parts.length - 1];

      if (method === 'PATCH') {
        const payload = parseJsonSafely(req.postData() || '') || {};
        const nome = String(payload?.nome || '').trim();
        const idx = store.findIndex((c) => String(c._id) === String(id));
        if (idx >= 0) store[idx] = { ...store[idx], nome };
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(store[idx] || null),
        });
      }

      if (method === 'DELETE') {
        const idx = store.findIndex((c) => String(c._id) === String(id));
        if (idx >= 0) store.splice(idx, 1);
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      }

      return route.fulfill({ status: 405, body: 'Method Not Allowed' });
    });

    await page.goto('/categorias');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Categorias' })).toBeVisible({ timeout: 15000 });

    // Lista (página 1 -> 10 itens)
    await expect(page.getByText('Categoria 01')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Categoria 10')).toBeVisible({ timeout: 15000 });

    // Paginação (vai para página 2 e valida itens)
    const nextPageBtn = page.locator('button[aria-label="Go to next page"]');
    if (await nextPageBtn.count()) {
      await nextPageBtn.click();
      await expect(page.getByText('Categoria 11')).toBeVisible({ timeout: 15000 });
    }

    // Filtro
    await page.getByLabel('Filtrar categorias').fill('15');
    await expect(page.getByText('Categoria 15')).toBeVisible({ timeout: 15000 });

    // Limpa filtro
    await page.getByRole('button', { name: 'limpar filtro' }).click();
    await expect(page.getByText('Categoria 01')).toBeVisible({ timeout: 15000 });

    // Ordenação (Z-A) e valida que começa com o maior nome (pode afetar paginação)
    await page.getByLabel('Ordenação').click();
    await page.getByRole('option', { name: 'Nome (Z-A)' }).click();
    await expect(page.getByText('Categoria 20')).toBeVisible({ timeout: 15000 });

    // Criar
    await page.getByRole('button', { name: 'Nova Categoria' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15000 });
    await dialog.getByLabel('Nome').fill('Nova Categoria Playwright');
    await dialog.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText('Nova Categoria Playwright')).toBeVisible({ timeout: 15000 });

    // Garante que a linha existe antes de seguir
    await expect(page.locator('tr', { hasText: 'Nova Categoria Playwright' }).first()).toBeVisible({ timeout: 15000 });

    // Editar (linha da categoria criada)
    await page.getByLabel(/editar categoria Nova Categoria Playwright/).click();

    const rowEditing = page.locator('tr', { has: page.getByRole('textbox') }).first();
    const editInput = rowEditing.getByRole('textbox').first();
    await expect(editInput).toBeVisible({ timeout: 15000 });
    await editInput.fill('Nova Categoria Editada');

    await page.getByLabel(/salvar categoria Nova Categoria Editada/).click();
    await expect(page.getByText('Nova Categoria Editada')).toBeVisible({ timeout: 15000 });

    // Excluir (linha editada)
    await page.getByLabel(/excluir categoria Nova Categoria Editada/).click();
    await expect(page.getByText('Nova Categoria Editada')).toHaveCount(0);
  });
});
