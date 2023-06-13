import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let kamen = async (cluster,page, positions, levels) => {
  try {
  
    await page.goto("https://www.isomeds.de/karriere.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".col-lg-6.col-md-6.col-sm-12.col-xs-12 > li > a"
        )
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "Kamen",
        hospital: "Isomed Isomed Reha Kamen",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine-Wesphelia",
        city: "Kamen",
        email: "",
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
        let lnk = document.querySelector(
          "body > div.container-fluid > div.row.row-content > div.col-lg-8 > div > div > div > div > div.nd > div.f > p > a"
        );
        return lnk ? lnk.href : "";
      });
      job.link = link;
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
      });
        if (positions.map(el => el.tLowerCase()).includes(job.position.tLowerCase())) {
          await save(job);
        }
    });
    }
  } catch (e) {
    print(e);
  }
};

export default kamen;
