const  scroll = async (page) => {
    await page.evaluate(() => {
        document.scrollingElement.scrollBy(0,document.scrollingElement.scrollHeight);
    });
}
export default scroll;