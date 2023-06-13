import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";
// import { String } from "joi";

let badBerleburg = async (cluster,page, positions, levels) => {
  try {

    await page.goto(
      "https://www.vamed-gesundheit.de/kliniken/bad-berleburg/unser-haus/karriere/stellenangebote/",
      "https://www.vamed-gesundheit.de/kliniken/bad-berleburg/unser-haus/karriere/stellenangebote/?cHash=40d678f92c231935e58ef1fc133742e7&tx_heliosuwsjoboffers_joboffers%5B%40widget_0%5D%5BcurrentPage%5D=2",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tabular-list__item > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Bad Berleburg",
          hospital: "VAMED Klinik Bad Berleburg",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Bad Berleburg",
          email:"",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.content-page-header__title");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
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
        let link = await page.evaluate(() => {
          let lnk = document.querySelector("div.block-text > p > a");
          return lnk ? lnk.href : "";
        });
        job.link = link;
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g) || 'N/A';
        });
        job.email = String() + email
         if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default badBerleburg;
