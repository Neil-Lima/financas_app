export async function registerAndLogin(page, { keepBrowserOpen = false } = {}) {
  const timestamp = Date.now();
  const name = `Usuário Teste ${timestamp}`;
  const email = `teste+${timestamp}@example.com`;
  const password = 'Teste@123';

  await page.goto('/');

  await page.getByRole('button', { name: 'Não tem uma conta? Registre-se aqui' }).click();

  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible', timeout: 10000 });

  await dialog.getByPlaceholder('Seu nome').fill(name);
  await dialog.getByPlaceholder('Seu email').fill(email);
  await dialog.getByPlaceholder('Sua senha').fill(password);

  await dialog.getByRole('button', { name: 'Registrar' }).click();

  // O registro fecha o modal via setShowRegisterModal(false), mas isso pode demorar por render/async.
  // Para evitar flakiness, primeiro aguardamos o feedback de sucesso e só então garantimos que o modal fechou.
  await page
    .getByRole('alert')
    .filter({ hasText: 'Registro bem-sucedido' })
    .first()
    .waitFor({ state: 'visible', timeout: 15000 });

  try {
    await dialog.waitFor({ state: 'hidden', timeout: 15000 });
  } catch {
    // fallback: fecha modal manualmente se ainda estiver aberto
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden', timeout: 15000 });
  }

  await page.getByPlaceholder('Seu email').first().fill(email);
  await page.getByPlaceholder('Sua senha').first().fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('**/home', { timeout: 15000 });

  if (keepBrowserOpen) {
    await page.pause();
  }

  return { name, email, password };
}
