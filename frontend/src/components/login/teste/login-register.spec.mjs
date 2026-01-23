import { test, expect } from '@playwright/test';

// Fluxo: registro de usuário novo e login em seguida
// Observação: é esperado que o backend esteja rodando e aceite esse fluxo.

test('registro e login de novo usuário', async ({ page }) => {
  // Aumenta o timeout deste teste específico para evitar falha por lentidão inicial
  test.setTimeout(60000);

  const timestamp = Date.now();
  const name = `Usuário Teste ${timestamp}`;
  const email = `teste+${timestamp}@example.com`;
  const password = 'Teste@123';

  // Acessa a tela inicial (Login)
  await page.goto('/');

  // Abre o modal de registro
  await page.getByRole('button', { name: 'Não tem uma conta? Registre-se aqui' }).click();

  // Espera o modal abrir
  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible', timeout: 10000 });

  // Preenche o formulário de registro no modal
  await dialog.getByPlaceholder('Seu nome').fill(name);
  await dialog.getByPlaceholder('Seu email').fill(email);
  await dialog.getByPlaceholder('Sua senha').fill(password);

  // Envia o formulário de registro
  await dialog.getByRole('button', { name: 'Registrar' }).click();

  // Espera o modal fechar
  await dialog.waitFor({ state: 'hidden', timeout: 15000 });

  // Preenche login com o usuário recém-criado (o app já preenche, mas garantimos)
  await page.getByPlaceholder('Seu email').first().fill(email);
  await page.getByPlaceholder('Sua senha').first().fill(password);

  // Envia o login
  await page.getByRole('button', { name: 'Login' }).click();

  // Valida que foi redirecionado para a home
  await page.waitForURL('**/home', { timeout: 15000 });
  await expect(page).toHaveURL(/.*\/home$/);

  // Opcional: manter o navegador aberto na Home para inspeção manual
  // Use PW_KEEP_OPEN=true para ativar.
  if (String(process.env.PW_KEEP_OPEN || '').toLowerCase() === 'true') {
    await page.pause();
  }
});
