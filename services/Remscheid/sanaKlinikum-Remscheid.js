import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";
const klinikumRemscheid = async (cluster,page,positions,levels) => {
  try {
    
    
    page.setDefaultNavigationTimeout(0);

    const jobLinks = [];
    let allUrls = [
      "https://www.sana.de/remscheid/karriere/stellenangebote/&nbsp;",
    ];

    // all jobsLinks;
    for (let a = 0; a < allUrls; a++) {
      cluster.queue(async ({ page }) => {
        await page.goto(allUrls[a]);
        scroll(page);
        let jobs = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("#container_2315 > a")).map(
            (el) => el.href
          );
        });
        jobLinks.push(...jobs);
      });
    }
    await page.waitForTimeout(3000);
    console.log(jobLinks);

    let jobDetails = [];
    for (let jobs of jobLinks) {
      cluster.queue(async ({ page }) => {
        let details = {
          title: "",
          location: "Radevormwald",
          hospital: "Sana Krankenhaus Radevormwald",
          link: "",
          level: "",
          position: "",
          email: "",
          republic: " North Rhine-Westphalia",
          city:"Radevoramwald"
        };
        scroll(page);
        await page.goto(jobs);
        let title = await page.evaluate(() => {
          let jbTitle = document.querySelector(
            ".section-title.section-title--size-1.t-col-2 > h1"
          );
          return jbTitle ? jbTitle.innerText : null;
        });
        details.title = title;
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
        let position = text.match(/arzt|pflege/);
        details.level = level ? level[0] : "";
        if (
          level == "Facharzt" ||
          level == "Chefarzt" ||
          level == "Assistenzarzt"
        ) {
          details.position = "artz";
        }
        if (position == "pflege" || (position == "Pflege" && !level in levels)) {
          details.position = "pflege";
          details.level = "Nicht angegeben";
        }

        let link = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z0-9+-/-]+.[a-zA-Z._-]+.@.[a-zA-Z0-9-]+\.[a-zA-Z0-9-_]+/g
          );
        });
        if (typeof link == "object") {
          details.link = link;
        }
        details.email = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z0-9+-/-]+.[a-zA-Z._-]+.@.[a-zA-Z0-9-]+\.[a-zA-Z0-9-_]+/g
          );
        });
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

export default klinikumRemscheid;
