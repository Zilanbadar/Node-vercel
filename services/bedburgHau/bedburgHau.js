import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let bedburgHau = async (cluster,page, positions, levels) => {
  try {
  
    await page.goto(
      "https://jobs.lvr.de/index.php?ac=search_result&search_criterion_division%5B%5D=42",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    await page.waitForSelector("tbody.jb-dt-list-body > tr > td > a");
    const jobLinks = await page.evaluate(() => {
      
      return Array.from(
        document.querySelectorAll("tbody.jb-dt-list-body > tr > td > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Bedburg-Hau",
          hospital: "Landschaftsverband Rheinland (LVR)",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Bedburg-Hau",
          email: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1#skip-to-main-heading");
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
          let apply = document.querySelector(
            "a.btn.btn-lg.btn-block.btn-primary.js-button-apply.btn-apply-top"
          );
          return apply ? apply.href : "";
        });
        job.link = link;

        let email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/gi) || 'N/A';
        });
        job.email = String() + email
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};


export default bedburgHau;
