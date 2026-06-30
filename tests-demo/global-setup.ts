import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv'; 
dotenv.config();

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  if(process.env.CI=== 'true'){
    console.log(`Creating test user: ${process.env.USER_DAN_USERNAME}`);

    const registerUrl = `${process.env.PARABANK_APP_LINK}register.htm`;

    await page.goto(registerUrl);
    // await page.locator('[id="customer.firstName"]').click();
    await page.locator('[id="customer.firstName"]').fill('Tomas');
    await page.locator('[id="customer.lastName"]').fill('Shelby');
    // await page.locator('[id="customer.address.street"]').click();
    await page.locator('[id="customer.address.street"]').fill('123 Test St');
    // await page.locator('[id="customer.address.city"]').click();
    await page.locator('[id="customer.address.city"]').fill('Mexico City');
    // await page.locator('[id="customer.address.state"]').click();
    await page.locator('[id="customer.address.state"]').fill('LA');
    // await page.locator('[id="customer.address.zipCode"]').click();
    await page.locator('[id="customer.address.zipCode"]').fill('3952');
    // await page.locator('[id="customer.phoneNumber"]').click();
    await page.locator('[id="customer.phoneNumber"]').fill('433245364');
    // await page.locator('[id="customer.ssn"]').click();
    await page.locator('[id="customer.ssn"]').fill('9032943');
    // await page.locator('[id="customer.username"]').click();
    await page.locator('[id="customer.username"]').fill(process.env.USER_DAN_USERNAME!);
    // await page.locator('[id="customer.password"]').click();
    await page.locator('[id="customer.password"]').fill(process.env.USER_DAN_PASSWORD!);
    // await page.locator('#repeatedPassword').click();
    await page.locator('#repeatedPassword').fill(process.env.USER_DAN_PASSWORD!);
    await page.getByRole('button', { name: 'Register' }).click();

    // Saves cookies + localStorage to a file
    await page.context().storageState({ path: '.auth/auth.json' });

    await browser.close();
  }  else{
  await page.goto(process.env.PARABANK_APP_LINK!);
  await page.locator('input[name="username"]').fill( process.env.USER_DAN_USERNAME!);
  await page.locator('input[name="password"]').fill(process.env.USER_DAN_PASSWORD!);
  await page.getByRole('button', { name: 'Log In' }).click();
//   await page.waitForURL('**/overview'); // wait until login completes
  
  

  // Saves cookies + localStorage to a file
  await page.context().storageState({ path: '.auth/auth.json' });

  await browser.close();
  }
}

export default globalSetup;