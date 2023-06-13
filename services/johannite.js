import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
import { Cluster } from "puppeteer-cluster";

let Karrer_evkb = async (page,positions,levels) => {
  try {
    
    let allJobsLinks = [];
    let allLinks = [
      "https://www.johanniter.de/mitarbeiten-lernen/stellenangebote/"
    ];

    let counter = 0;
    do {
      Cluster.queue(async({ page }) => {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      // get all job links
      const jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".c-content-list__text > h3 > a")
        ).map((el) => el.href);
      });
      console.log(jobLinks);
      allJobsLinks.push(...jobLinks);
      counter++;
        await page.waitForTimeout(3000);
      });
    } while (counter < allLinks.length);

    for (let jobLink of allJobsLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Waldkrankenhaus Bonn",
          hospital: "Evangelisches Krankenhaus Bethesda Mönchengladbach",
          link: "",
          level: "",
          position: "",
          city: "Mönchengladbach",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

    
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
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
    
        let email = await page.evaluate(() => {
          let text = document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/)
          return text[0] || ""
        });

        job.email = email;
        job.link = jobLink;
        
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
    
  } catch (e) {
    print(e);
  }
};


export default Karrer_evkb;
