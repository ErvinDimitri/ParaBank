import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv'; 
dotenv.config();

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(process.env.PARABANK_APP_LINK!);
  await page.locator('input[name="username"]').fill( process.env.USER_DAN_USERNAME!);
  await page.locator('input[name="password"]').fill(process.env.USER_DAN_PASSWORD!);
  await page.getByRole('button', { name: 'Log In' }).click();
//   await page.waitForURL('**/overview'); // wait until login completes

  // Saves cookies + localStorage to a file
  await page.context().storageState({ path: '.auth/auth.json' });

  await browser.close();
}

export default globalSetup;