import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from  "../../utils/save.js";

let euskirchen = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto(
      "https://www.marien-hospital.com/karriere/stellenangebote",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    await page.waitForSelector('#job_id_12865112 > div.matchValue.title > a')
    const jobLinks = await page.evaluate(() => {
        // let a = document.querySelector("#job-search-pagination > li:nth-child(5) > a");
        // a.click()
      return Array.from(document.querySelectorAll("#job_id_12865112 > div.matchValue.title > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Euskirchen",
          hospital: "Marien",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Euskirchen",
          email: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("#main-title");
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
          let apply = document.querySelector("#applynow")
          return apply ? apply.innerText : "";
        });
        job.link = link;
       let email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/gi) || 'N/A';
        })
        job.email = String() + email
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default euskirchen;
