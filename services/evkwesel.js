import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
import { f } from "node-apidoc";

let EvkWesel = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://mehrdrinalserwartet.de/offene-stellen", {
      waitForTimeout: 0,
    });

    await page.waitForTimeout(1000);
    await scroll(page);

    // get all job links
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".anzeige > h3 a")).map(
        (el) => el.href
      );
    });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "Wesel",
          hospital: "Evangelisches Krankenhaus Wesel",
          link: "",
          level: "",
          position: "",
          city: "Wesel",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".col-md-9 h1");
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
          let text = document.querySelector("p.mail");
          return text ? text.innerText : null;
        });

        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        //   getting applylink
        let link = await page.evaluate(() => {
          let Link = document.querySelector(".btn.btn-cta");
          return Link ? Link.href : "";
        });

        job.link = link;

        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};



export default EvkWesel;
