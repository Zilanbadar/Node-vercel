import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let evk_karrier1 = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://evk-karriere.de/stellenangebote/mediziner/", {
      timeout: 0,
    });
    await scroll(page);

    //getting all the links
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".wpv-loop.js-wpv-loop > tr > td a")
      ).map((el) => el.href);
    });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Castrop-Rauxel",
          hospital: "Evangelisches Krankenhaus Castrop-Rauxel",
          link: "",
          level: "",
          position: "",
          email: "karriere@evkhg-herne.de",
          republic: "North Rhine-Westphalia",
          city: "Gelsenkirchen"
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".col-md-8.testID h1");
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
        let link = await page.evaluate(() => {
          let applink = document.querySelector(
            ".x-btn.x-btn-flat.x-btn-pill.x-btn-regular"
          );
          return applink ? applink.href : " ";
        });

        job.link = link;
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
  } catch (error) {
    print(error);
  }
};

export default evk_karrier1;
