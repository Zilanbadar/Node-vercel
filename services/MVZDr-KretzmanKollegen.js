import puppeteer from "puppeteer";
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let MVZDr_KretzmanKollegen = async (cluster,page,positions,levels) => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.dr-kretzmann.de/Jobs/index.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("ul#sub_nav > li > a")
      ).map((el) => el.href);
      return urls;
    });
    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Dortmund",
          hospital: "MVZ Dr. Kretzmann & Kollegen – Unioncarré",
          link: "",
          level: "",
          position: "",
          city: "Dortmund",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let jbTitle = document.querySelector("div.block_content.headline > h1");
          return jbTitle ? jbTitle.innerText : null
        });
      
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
          return document.body.innerText.match(/([a-zA-Z0-9_+./-]+\(\w+\)[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)|([a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)/) || "N/A";
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
      }
  } catch (err) {
    print(err);
  }
};



export default MVZDr_KretzmanKollegen;
