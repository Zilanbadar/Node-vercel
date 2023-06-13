import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";
import { job } from "cron";

const deutsche_rentenversicherung = async (cluster,page, positions,levels) => {
  try {
    
    await page.goto(
      "https://salzetal.deutsche-rentenversicherung-reha-zentren.de/subsites/Salzetal/de/Navigation/04_Service/Stellenangebote/Stellenangebote_node.html"
    );
    page.setDefaultNavigationTimeout(0);
    const jobLinks = [];
    let allUrls = [
      "https://salzetal.deutsche-rentenversicherung-reha-zentren.de/subsites/Salzetal/de/Navigation/04_Service/Stellenangebote/Stellenangebote_node.html",
    ];
    // get all jobs links
    for (let a = 0; a < allUrls.length; a++) {
      cluster.queue(async ({ page }) => {
        await page.goto(allUrls[a]);
        scroll(page);
        let jobs = await page.evaluate(() => {
          return Array.from(document.querySelectorAll(".odd > a")).map(
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
          location: " Hemer",
          hospital: "Lungenklinik Hemer",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Hemer",
          email:"",
        };
        scroll(page);
        await page.goto(jobs);

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
          level == "Assistenzarzt" ||
          level == "Arzt" ||
          level == "Oberarzt"
        ) {
          details.position = "artz";
        }
        if (position == "pflege" || (position == "Pflege" && !level in levels)) {
          details.position = "pflege";
          details.level = "Nicht angegeben";
        }
        //get link
        let link = await page.evaluate(() => {
          return document.body.innerText.match(
            /[A_Za-z0-9-._+/]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g
          );
        });
        if (typeof link == "object") {
          details.link = { ...link };
        }
        let title = await page.evaluate(() => {
          let jbTitle = document.querySelector(".large-34.small-72.columns > h1");
          return jbTitle ? jbTitle.innerText : null;
        });
        details.title = title;

        jobDetails.push(details);
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/[A_Za-z0-9-._+/]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g) || 'N/A';
        });

        job.email = String() + email;

          if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};

export default deutsche_rentenversicherung;
