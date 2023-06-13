import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const klinikSorpesee = async (cluster,page,positions,levels) => {
  try {
    const url = "https://www.klinik-sorpesee.de/karriere/stellenangebote/";

    await page.goto(url, { timeout: 0, waitUntil: "load" });
    await scroll(page);
    page.waitForTimeout(3000);

    //get all job links
    await page.evaluate(() => {
      let jobCollection = [];
      let jobLinks = Array.from(
        document.querySelectorAll(
          "h3.accordionHeader.accordionHeaderCollapsible.accordionHeaderHidden"
        )
      );

      for (let jobLink of jobLinks) {
        cluster.queue(async ({ page }) => {
          let job = {
            title: "",
            location: "Sundern (Sauerland)",
            hospital: "Neurologische Klinik Sorpe",
            link: "",
            level: "",
            position: "",
            level: '',
            republic: '',
          };

          for (let i = 0; i < 2 * i; i++) {
            document.scrollingElement.scrollBy(0, 100);
            setTimeout(1000);
          }

          jobLink.click();
          //get title
          job.title = jobLink.innerText;
          let text = document.body.innerText;
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
          let position = text.match(/arzt|pflege/);
          job.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt" ||
            level == "Arzt" ||
            level == "Oberarzt"
          ) {
            job.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            job.position = "pflege";
            job.level = "Nicht angegeben";
          }

          //get applyLink
          job.link = jobLink;
          if (positions.map(el => el.toLowerCase()).include(job.position.toLowerCase())) {
            await save(job);
          }
        });
      }
    });
  } catch (error) {
    print(error);
  }
};

export default klinikSorpesee;
