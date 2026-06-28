import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv'; 
dotenv.config();

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  if(process.env.CI){
    console.log(`Creating test user: ${process.env.USER_DAN_USERNAME}`);

    const registerUrl = `${process.env.PARABANK_APP_LINK}services/bank/customers/new`;

    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        address: {
          street: '123 Test St',
          city: 'Testville',
          state: 'CA',
          zipCode: '12345',
        },
        phoneNumber: '1234567890',
        ssn: '123-45-6789',
        username: process.env.USER_DAN_USERNAME,
        password: process.env.USER_DAN_PASSWORD,
      }),
    });
  }else{
    await page.goto(process.env.PARABANK_APP_LINK!);
    await page.locator('input[name="username"]').fill( process.env.USER_DAN_USERNAME!);
    await page.locator('input[name="password"]').fill(process.env.USER_DAN_PASSWORD!);
    await page.getByRole('button', { name: 'Log In' }).click();
  //   await page.waitForURL('**/overview'); // wait until login completes
  }
  

  // Saves cookies + localStorage to a file
  await page.context().storageState({ path: '.auth/auth.json' });

  await browser.close();
}

export default globalSetup;