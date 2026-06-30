import { test, expect, Page } from '@playwright/test';

test.describe('Transfer Funds', ()=>{
    let sender_available_balance=0;
    let receiver_balance=0;
    let sender_acc='';
    let receiver_acc='';

    //async function createAccount(page: Page, baseURL:string){
    test('Create Account', async ({ page, baseURL }) => {
        if(process.env.CI=== 'true'){
            await page.goto(baseURL?.concat('openaccount.htm')!);
            await page.getByRole('button', { name: 'Open New Account' }).click();
        }
    });

    async function loadBalances(page: Page, baseURL:string){
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');  // Create a timestamp for the filename
        await page.goto(baseURL?.concat('overview.htm')!)

        await page.screenshot({ path: `screenshots/balances-${timestamp}.png` });

        let table_sender_line = page.locator('tr').nth(1);
        sender_acc = await table_sender_line.locator('td').first().textContent();
        sender_available_balance = await table_sender_line.locator('td').last().textContent();
        sender_available_balance = parseFloat(sender_available_balance.replace(/[$,]/g, ''));

        let table_receiver_line = page.locator('tr').nth(2);
        receiver_acc = await table_sender_line.locator('td').first().textContent();
        receiver_balance = await table_receiver_line.locator('td').nth(1).textContent();
        receiver_balance = parseFloat(receiver_balance.replace(/[$,]/g, ''));

        await page.getByText('Transfer Funds').click();
    }


    test('Transfer available funds', async ({ page, baseURL }) => {
        await loadBalances(page, baseURL!);
        let before_sender_available_balance = sender_available_balance;
        let before_receiver_balance = receiver_balance;
        let amount = 200;

        await page.locator('#amount').click();
        await page.locator('#amount').fill(String(amount));
        await page.locator('#toAccountId').selectOption(receiver_acc);
        await page.getByRole('button', { name: 'Transfer' }).click();
        await expect(page.locator('#showResult')).toContainText('$200.00 has been transferred from account #'+sender_acc+' to account #'+receiver_acc+'.');
        
        await loadBalances(page, baseURL!);

        console.log(sender_available_balance, before_sender_available_balance)
        expect(sender_available_balance).toEqual(before_sender_available_balance - amount);
        expect(receiver_balance).toEqual(before_receiver_balance + amount);
    });

    test('Transfer negative amount', async ({ page, baseURL }) => {
        await loadBalances(page, baseURL!);
        let before_sender_available_balance = sender_available_balance;
        let before_receiver_balance = receiver_balance;
        let negativeAmount = -1000;

        await page.locator('#amount').click();
        await page.locator('#amount').fill(String( negativeAmount));
        await page.locator('#toAccountId').selectOption(receiver_acc);
        await page.getByRole('button', { name: 'Transfer' }).click();
        await expect(page.locator('#showResult')).not.toContainText('-$10000.00 has been transferred from account #'+sender_acc+' to account #'+receiver_acc+'.');
    
        //The balances shouldnt update
        await loadBalances(page, baseURL!);
        expect(sender_available_balance).toEqual(before_sender_available_balance);
        expect(receiver_balance).toEqual(before_receiver_balance);
    });
});
