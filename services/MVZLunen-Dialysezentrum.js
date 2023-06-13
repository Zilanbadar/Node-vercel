import puppeteer from "puppeteer";
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let MVZLunen_Dialysezentrum = async (cluster,page,positions,levels) => {
  try {

    await page.goto("http://www.dialyse-westfalen.de/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("div.entry-content > ul > li > a")
      ).map((el) => el.href);
      return urls;
    });

    console.log(jobLinks);
    let counter = 0;
    let jobTitles = await page.evaluate( () => {
        return Array.from(
            document.querySelectorAll("div.entry-content > ul > li ")
          ).map((el) => el.innerText);
    })
    let email = await page.evaluate(() => {
      return document.body.innerText.match(/([a-zA-Z0-9_+./-]+\(\w+\)[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)|([a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)/) || "N/A";
    });

    let text = await page.evaluate(() => {
      return document.body.innerText;
    });
    let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
    let position = text.match(/arzt|pflege/);

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Lünen",
          hospital: "MVZ Lünen Dialysezentrum",
          link: "",
          level: "",
          position: "",
          city: "Lünen",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = jobTitles[counter]
        counter++;
      
        job.level = level;
        job.position = position;
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
  
        job.email = email;
        if (typeof job.email == "object" && job.email != null) {
          job.email = "" + job.email;
        }

        job.link = jobLink;
        await page.waitForTimeout(2000);
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};

export default MVZLunen_Dialysezentrum;