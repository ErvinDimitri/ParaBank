import { test, expect, Page } from '@playwright/test';

test.describe('Transfer Funds', ()=>{
    let sender_available_balance=0;
    let receiver_balance=0;
    const sender_acc='13788';
    const receiver_acc='13899';

    async function loadBalances(page: Page, baseURL:string){
        page.goto(baseURL?.concat('overview.htm')!)
        let table_sender_line = page.locator('tr', {hasText: sender_acc})
        sender_available_balance = await table_sender_line.locator('td').last().textContent();
        sender_available_balance = parseFloat(sender_available_balance.replace(/[$,]/g, ''));

        let table_receiver_line = page.locator('tr', {hasText: receiver_acc})
        receiver_balance = await table_receiver_line.locator('td').nth(1).textContent();
        receiver_balance = parseFloat(receiver_balance.replace(/[$,]/g, ''));

        await page.getByText('Transfer Funds').click();
    }

    test.skip('Transfer available funds', async ({ page, baseURL }) => {
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

        console.log(receiver_balance, before_receiver_balance)
        expect(sender_available_balance).toEqual(before_sender_available_balance - amount);
        expect(receiver_balance).toEqual(before_receiver_balance + amount);
    });

    test.skip('Transfer negative amount', async ({ page, baseURL }) => {
        await loadBalances(page, baseURL!);

        let negativeAmount = -1000
        await page.locator('#amount').click();
        await page.locator('#amount').fill(String( negativeAmount));
        await page.locator('#toAccountId').selectOption(receiver_acc);
        await page.getByRole('button', { name: 'Transfer' }).click();
        await expect(page.locator('#showResult')).not.toContainText('-$10000.00 has been transferred from account #'+sender_acc+' to account #'+receiver_acc+'.');
    });
});
