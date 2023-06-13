import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let KrankenhausBethanien = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://jobs.diakonie-bethanien.de/jobs", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page)
        //get all jobLinks
        let nextPage = true;
        let allJobLinks = [];
        while (nextPage) {
          //scroll the page
          cluster.queue(async ({ page }) => {
            await scroll(page)
         
            await page.waitForTimeout(3000)
            //get all jobLinks
            let jobLinks = await page.evaluate(() => {
              return Array.from(
                document.querySelectorAll("div.jobfeed-inner > a")
              ).map((el) => el.href);
            });
            allJobLinks.push(...jobLinks);
            await page.waitForTimeout(3000);
            let bottomNextLink = await page.evaluate(() => {
              return document.querySelector("div > .pagination-button .next-page");
            });
            if (bottomNextLink) {
              await page.click("div > .pagination-button .next-page");
              nextPage = true;
            } else {
              nextPage = false;
            }
          });
        } //end of while loop
      
        
   
    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "Solingen",
          hospital: "Krankenhaus Bethanien",
          link: "",
          level: "",
          position: "",
          city: "Solingen",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1#tms-job-title");
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
 
        //get link
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9-_/.]+@[a-zA-Z0-9_/-]+\.[a-zA-Z0-9-_/]+/g);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = await page.evaluate(() => {
          let apply = document.querySelector('div#tms-action-editor > a.button')
          return apply ? apply.href : null
        })
        
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    console.log(e);
  }
};


export default KrankenhausBethanien;