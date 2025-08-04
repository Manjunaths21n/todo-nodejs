
import { test, expect } from '@playwright/test';

test('repeatedly open and close editor without freeze', async ({ page }) => {
    // Reduce iterations to a reasonable number
    const MAX_CYCLES = 10;
    let cycleCount = 0;
    test.setTimeout(MAX_CYCLES * 5000); // 5s per cycle

    await page.goto('http://localhost:5173');

    // Listen to browser console
    // page.on('console', msg => {
    //     console.log(`[BROWSER] ${msg.text()}`);
    // });

    for (let i = 0; i < MAX_CYCLES; i++) {
        cycleCount++;
        console.log(`Cycle ${i + 1}/${MAX_CYCLES}`);

        // 1. OPEN EDITOR - with robust error handling
        try {
            await page.click('[data-testid="toggle-editor"]');
        } catch (error) {
            console.error(`*********Open failed at cycle ${i + 1}:`, error);
            await page.screenshot({ path: `cycle-${i + 1}-open-failed.png` });
            break;
        }

        // 2. WAIT FOR EDITOR - with bailout mechanism
        try {
            await page.waitForSelector('.monaco-editor', { state: 'visible', timeout: 30000 });
        } catch (error) {
            console.error(`**************Editor not ready at cycle ${i + 1}:`, error);
            await page.screenshot({ path: `cycle-${i + 1}-editor-missing.png` });
            break;
        }

        // 3. CLOSE EDITOR - with enhanced reliability
        try {
            await page.click('[data-testid="toggle-editor"]');
            // page.on('console', msg => {
            //     console.log(`[BROWSER] ${msg.text()}`);
            // });
            await page.waitForSelector('.monaco-editor', {
                state: 'hidden',
                timeout: 10000
            });
        } catch (error) {
            console.error(`***************Close failed at cycle ${i + 1}:`, error);
            await page.screenshot({ path: `cycle-${i + 1}-close-failed.png` });
            break;
        }

        // // 4. SAFE CLEANUP - with memory protection
        // try {
        //     await page.evaluate(() => {
        //         // Dispose models in chunks to prevent freeze
        //         // if (window.monaco?.editor) {
        //             const models = window.monaco.editor.getModels();
        //             console.log(models.length);
        //             // console.log(`[Cleanup] Disposing ${models.length} models`);

        //         //     // Dispose in chunks to avoid blocking
        //         //     const CHUNK_SIZE = 5;
        //         //     for (let i = 0; i < models.length; i += CHUNK_SIZE) {
        //         //         const chunk = models.slice(i, i + CHUNK_SIZE);
        //         //         chunk.forEach(model => model.dispose());
        //         //     }
        //         // }
        //     });
        // } catch (error) {
        //     console.error(`****************Cleanup failed at cycle ${i + 1}:`, error);
        // }

        // // 5. MEMORY SAFEGUARD
        // if (i > 0 && i % 5 === 0) {
        //     // Force GC only every 5 cycles
        //     await page.evaluate(() => {
        //         if (window.gc) {
        //             console.log('[Memory] Forcing GC');
        //             window.gc();
        //         }
        //     });
        // }

        // Short pause with progress monitoring
        await page.waitForTimeout(300);
        console.log(`Completed cycle ${i + 1}/${MAX_CYCLES}`);
    }

    // FINAL MEMORY CHECK (safer approach)
    const finalModels = await page.evaluate(() => {
        try {
            console.log('window.monaco');
            return window.monaco?.editor?.getEditors()?.length || 0;
        } catch {
            return -1; // Editor not available
        }
    });
           const fun= await page.evaluate(() => {return window.monaco?.editor.getEditors().length}); 
console.log(`Final window.monaco: ${fun}`);
    console.log(`Final Monaco models: ${finalModels}`);
    expect(cycleCount).toBe(MAX_CYCLES);
    expect(finalModels).toBeLessThanOrEqual(1);
});
