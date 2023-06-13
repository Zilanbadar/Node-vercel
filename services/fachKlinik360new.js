import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let fachKLinik = async (cluster,page, positions,levels) => {
  try {
   

    await page.goto(
      "https://www.fachklinik360grad.de/karriere/aktuelle-stellenangebote/aerztliches-personal/",
      {
        waitForTimeout: 0,
      }
    );

    await page.waitForTimeout(1000);
    await scroll(page);

    // get all job links
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".outerJob.activmap-place a")
      ).map((el) => el.href);
    });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Fachklinik 360°",
          link: "",
          level: "",
          position: "",
          city: "Ratingen",
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

        job.location = await page.evaluate(() => {
          let text = document.querySelector(".content");
          return text
            ? text.innerText.match(/[a-zaA-Z-.]+ \d+ [-|-] \d+ [a-zaA-Z-. ]+/)
            : null;
        });

        if (typeof job.location == "object" && job.location != null) {
          job.location = job.location[0];
        }

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

        job.email = await page.evaluate(() => {
          let text = document.querySelector(".vacancy-single");
          return text ? text.innerText.match(/[a-zA-Z.-]+@[a-zA-Z-.]+/) : "";
        });

        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        //   getting applylink
        let link = await page.evaluate(() => {
          let Link = document.querySelector(".cta a");
          return Link ? Link.href : "";
        });

        job.link = link;
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};



export default fachKLinik;
