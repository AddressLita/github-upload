beforeEach(async () => {
    await jestPlaywright.resetPage();
    await page.goto("https://demoqa.com/elements");
})

describe("Text box tests", () => {

    describe("Main tests", () => {
        test("Should navigate to '/text-box' url", async () => {
            await page.click('#item-0');
            expect(page.url()).toMatch(/text-box/);
        })
        test("Should fill form and fields be displayed after clicking submit", async () => {
            await page.click('#item-0');
            await page.type('#userName', "AddressLita");
            await page.type('#userEmail', "test@test.com");
            await page.type('#currentAddress', "test address");
            await page.type('#permanentAddress', "test address that is permanent");
            await page.click('#submit');
            await expect(page).toHaveSelector('#name');
            await expect(page).toHaveSelector('#email');
            await expect(page).toHaveSelector('text=Current Address :'); //lack of unique id solved by text
            await expect(page).toHaveSelector('#output >> #permanentAddress'); //lack of unique id solved by combined selectors
        })
        test("Should display error border if email does not comply with format", async () => {
            await page.click('#item-0');
            await page.type('#userName', "AddressLita");
            await page.type('#userEmail', "testmail");
            await page.type('#currentAddress', "test address");
            await page.type('#permanentAddress', "test address that is permanent");
            await page.click('#submit');
            await expect(page).toHaveSelector('.field-error') // Error checking based on class for error style
        })
        test("Should display the information that was provided in the inputs", async () => {
            const fullName = "AddressLita";
            const email = "testmail@test.com";
            const curAddr = "Test current address";
            const permAddr = "Test address that is permanent";
            await page.click('#item-0');
            await page.type('#userName', fullName);
            await page.type('#userEmail', email);
            await page.type('#currentAddress', curAddr);
            await page.type('#permanentAddress', permAddr);
            await page.click('#submit');
            await expect(page).toHaveText('#name', fullName);
            await expect(page).toHaveText('#email', email);
            await expect(page).toHaveText('text=' + curAddr, curAddr); //lack of unique id solved by text
            await expect(page).toHaveText('#output >> #permanentAddress', permAddr); //lack of unique id solved by combined selectors

        })
        test("Should not display fields that where not filled", async () => {
            await page.click('#item-0');
            await page.type('#currentAddress', "test address");
            await page.type('#permanentAddress', "test address that is permanent");
            await page.click('#submit');
            await expect(page).not.toHaveSelector('#name', { timeout: 1 * 1000 });
            await expect(page).not.toHaveSelector('#email', { timeout: 1 * 1000 });
        })
    })

    describe("UI intended tests", () => {
        test("Should contain main-header with 'Text Box' text", async () => {
            await page.click('#item-0');
            await expect(page).toEqualText('.main-header', "Text Box");
        })
        test("Should display form containing fields for: name, email, cur address and perm address", async () => {
            await page.click('#item-0');
            await expect(page).toHaveSelector('form >> #userName-wrapper');
            await expect(page).toHaveSelector('form >> #userEmail-wrapper');
            await expect(page).toHaveSelector('form >> #currentAddress-wrapper');
            await expect(page).toHaveSelector('form >> #permanentAddress-wrapper');
        })
    })
})

// Check box section is considered as static
describe("Check box tests", () => {
    describe("Main tests", () => {
        test("Should navigate to '/checkbox' url", async () => {
            await page.click('#item-1');
            expect(page.url()).toMatch(/checkbox/);
        })
        test("Should display next file level when the arrow is clicked", async () => {
            await page.click('#item-1');
            await page.click('[title=Toggle]');
            await expect(page).toHaveSelector('"Desktop"');
            await expect(page).toHaveSelector('"Documents"');
            await expect(page).toHaveSelector('"Downloads"');
        })
        test("Should display 'You have selected :' message with all folders and files when selecting home folder", async () => {
            await page.click('#item-1');
            await page.click('[for=tree-node-home]');
            await expect(page).toHaveSelector('#result');
            await expect(page).toEqualText('#result', "You have selected :homedesktopnotescommandsdocumentsworkspacereactangularveuofficepublicprivateclassifiedgeneraldownloadswordFileexcelFile")
        })
        test("Should hide 'You have selected' message when clicking and already selected home folder", async () => {
            await page.click('#item-1');
            await page.click('[for=tree-node-home]');
            await expect(page).toHaveSelector('#result');
            await page.click('[for=tree-node-home]');
            await expect(page).not.toHaveSelector('#result', { timeout: 1 * 1000 });
        })
        test("Should select every element by clicking a partially selected home folder", async () => {
            await page.click('#item-1');
            await page.click('[title=Toggle]');
            await page.click('[for=tree-node-desktop]');
            await page.click('[for=tree-node-home]');
            await expect(page).toEqualText('#result', "You have selected :homedesktopnotescommandsdocumentsworkspacereactangularveuofficepublicprivateclassifiedgeneraldownloadswordFileexcelFile");
        })
        test("Should display all items after clicking '+' icon", async () => {
            await page.click('#item-1');
            await page.click('[aria-label="Expand all"]');
            await expect(page).toHaveSelector('"Home"');
            await expect(page).toHaveSelector('"Desktop"');
            await expect(page).toHaveSelector('"Notes"');
            await expect(page).toHaveSelector('"Commands"');
            await expect(page).toHaveSelector('"Documents"');
            await expect(page).toHaveSelector('"WorkSpace"');
            await expect(page).toHaveSelector('"React"');
            await expect(page).toHaveSelector('"Angular"');
            await expect(page).toHaveSelector('"Veu"');
            await expect(page).toHaveSelector('"Office"');
            await expect(page).toHaveSelector('"Public"');
            await expect(page).toHaveSelector('"Private"');
            await expect(page).toHaveSelector('"Classified"');
            await expect(page).toHaveSelector('"General"');
            await expect(page).toHaveSelector('"Downloads"');
            await expect(page).toHaveSelector('"Word File.doc"');
            await expect(page).toHaveSelector('"Excel File.doc"');
        })
        test("Should hide all items after clicking '-' icon", async () => {
            await page.click('#item-1');
            await page.click('[aria-label="Expand all"]');
            await page.click('[aria-label="Collapse all"]');
            await expect(page).not.toHaveSelector('"Notes"', { timeout: 1 * 1000 });
        })
        test("Should select all items inside desktop folder when selecting it", async () => {
            await page.click('#item-1');
            await page.click('[title=Toggle]');
            await page.click('[for=tree-node-desktop]');
            await expect(page).toEqualText('#result', "You have selected :desktopnotescommands");
        })
        test("Should unselect all items inside desktop folder when clicking an already selected desktop folder", async () => {
            await page.click('#item-1');
            await page.click('[title=Toggle]');
            await page.click('[for=tree-node-desktop]');
            await expect(page).toHaveSelector('#result');
            await page.click('[for=tree-node-desktop]');
            await expect(page).not.toHaveSelector('#result', { timeout: 1 * 1000 });
        })
        test("Should select all items inside documents folder when selecting it", async () => {
            await page.click('#item-1');
            await page.click('[title=Toggle]');
            await page.click('[for=tree-node-documents]');
            await expect(page).toEqualText('#result', "You have selected :documentsworkspacereactangularveuofficepublicprivateclassifiedgeneral");
        })
        test("Should unselect all items inside documents folder when clicking an already selected documents folder", async () => {
            await page.click('#item-1');
            await page.click('[title=Toggle]');
            await page.click('[for=tree-node-documents]');
            await expect(page).toHaveSelector('#result');
            await page.click('[for=tree-node-documents]');
            await expect(page).not.toHaveSelector('#result', { timeout: 1 * 1000 });
        })
        test("Should display selected file's filename in results", async () => {
            await page.click('#item-1');
            await page.click('[title=Toggle]');
            await page.click(':nth-match(li ol [title=Toggle], 3)');
            await page.click('[for=tree-node-wordFile]');
            await expect(page).toHaveText('#result', "wordFile");
        })

        describe("UI intended tests", () => {
            test.todo("main header check box")
            test.todo("home folder is displayed")
        })
    })
})

describe("UI tests for general sections", () => {
    test("Should display ToolsQA image", async () => {
        await page.click('#item-0');
        const headerImage = await page.$('header >> img');
        expect(await headerImage.getAttribute('src')).toContain("Toolsqa.jpg");
    })
    test("Should display element list navigation bar with expected items", async () => {
        await page.click('#item-0');
        await expect(page).toEqualText('.show >> #item-0', "Text Box");
        await expect(page).toEqualText('.show >> #item-1', "Check Box");
        await expect(page).toEqualText('.show >> #item-2', "Radio Button");
        await expect(page).toEqualText('.show >> #item-3', "Web Tables");
        await expect(page).toEqualText('.show >> #item-4', "Buttons");
        await expect(page).toEqualText('.show >> #item-5', "Links");
        await expect(page).toEqualText('.show >> #item-6', "Broken Links - Images");
        await expect(page).toEqualText('.show >> #item-7', "Upload and Download");
        await expect(page).toEqualText('.show >> #item-8', "Dynamic Properties");

    })
})

