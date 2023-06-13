import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";
let mathias = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto("https://www.mathias-karriere.de/stellenangebote", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".results-col a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Rheine",
          hospital: "Jakobi Hospital Rheine",
          link: "",
          level: "",
          position: "",
          email: "",
          republic: " North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            ".frame-type-header.co_msjobs-single__header h1"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
        //   console.log(title);

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
        let link = await page.evaluate(() => {
          let lnk = document.querySelector(".contentBox a");
          return lnk ? lnk.href : "";
        });
        job.link = link;
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/gi);
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


export default mathias;
