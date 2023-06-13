import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const krefeld = async (cluster, page, positions, levels) => {
  try {
    await page.goto(
      "https://www.helios-gesundheit.de/kliniken/krefeld-uerdingen/unser-haus/karriere/stellenangebote/",
      {
        waitUntil: "load",
        waitForTimeout: 0,
      }
    );
    // await page.waitForTimeout(1000);
    await scroll(page);
    // all job links
      const jobsLinks = await page.evaluate(() => {
        return Array.from(
            document.querySelectorAll("ul.pagination__list > li> a")
          ).map((el) => el.href);
      });
    //   console.log(jobsLinks);
    let jobLinks = []
     for (const links of jobsLinks) {
          await page.goto(links, {
            waitUntil: "load",})
       let jobLinks1 = await page.evaluate( ()=>{
           return Array.from(
            document.querySelectorAll("a.tabular-list__link")
          ).map((el) => el.href);
       })
       jobLinks.push(...jobLinks1)
       console.log(jobLinks1);
     }
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
          job.title = await page.evaluate(() => {
            let ttitle = document.querySelector("h2.billboard-panel__title");
            return ttitle ? ttitle.innerText : "";
          });
          job.location = await page.evaluate(() => {
            let text = document.querySelector("tbody > tr");
            return text ? text.innerText : null
              // ? text.innerText.match(/[a-zaA-Z-.]+ \d+ [-|-] \d+ [a-zaA-Z-. ]+/)
              // : null;
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
            return document.body.innerText.match(/[a-zA-Z0-9_/.-]+@[a-zA-Z-._.]+\.[a-zA-Z0-9]+/) || "N/A";
          });
          if (typeof job.email == "object" && job.email != null) {
            job.email = job.email[0];
          }
          //   getting applylink
          let link = await page.evaluate(() => {
            let Link = document.querySelector("a.button");
            return Link ? Link.href : "";
          });
          job.link = link;
          if (positions.map(el => el.toLowerCase()).include(job.position)) {
            await save(job);
          }
        });
      }
    } catch (err) {
    print(err);
  }
};

export default krefeld;
