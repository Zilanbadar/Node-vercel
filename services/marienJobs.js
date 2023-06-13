import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let marienborn_jobs = async (cluster, page, positions,levels) => {
  try {
    
    await page.goto("https://www.marienborn-jobs.de/stellenangebote/", {
      waitForTimeout: 0,
    });

    await page.waitForTimeout(1000);
    await scroll(page);

    // get all job links
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".job-offers-list > ul > li a")
      ).map((el) => el.href);
    });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location:"Zulpich",
          hospital:
            "Fachklinik für Psychiatrie und Psychotherapie der Marienborn",
          link: "",
          level: "",
          position: "",
          city: "Zülpich",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.headline");
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

        //get link
        job.email = await page.evaluate(() => {
          let text = document.querySelector(".bewerbung-content");
          return text ? text.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/) : null;
        });

        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        //   getting applylink
        let link = await page.evaluate(() => {
          let Link = document.querySelector(".button-jetzt-bewerben");
          return Link ? Link.href : "";
        });

        job.link = link;
        
        if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};


// EvkWesel()
export default marienborn_jobs;
