import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js"


let MalteserKrankenhaus_StAnna = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto("https://www.helios-gesundheit.de/kliniken/duisburg-anna/unser-haus/karriere/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

      let pagination = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("a.pagination__number-link.pagination__number-link--linked")
        ).map((el) => el.href);
      });
      
      let jobLinks = []
      for (const urls of pagination) {
        cluster.queue(async({page})=>{
        
        await page.goto(urls, {
          waitUntil : "load",
          timeout : 0
        });
        let url = await page.evaluate ( () => {
          return Array.from(
            document.querySelectorAll("a.tabular-list__link")
          ).map((el) => el.href);
        })
          jobLinks.push(...url);
      });
      }

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
      
      let job = {
        title: "",
        location: "",
        hospital: "Malteser Krankenhaus St. Anna",
        link: "",
        level: "",
        position: "",
        city: "Duisburg",
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
        let loc = document.querySelector(" div.job-details__table > div > table > tbody > tr:nth-child(1) > td:nth-child(2)")
        // loc = loc.replace("\n", " ");
        return loc  ? loc.innerText :  "N/A"
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
   
      //get link
      job.email = await page.evaluate(() => {
        let mail = document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g);
        return mail || "N/A"
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }

      job.link = await page.evaluate ( () => {
        let apply = document.querySelector('a.button')
        return apply ? apply.href : null;
      })
      if(positions.map(el => el.toLowerCase()).include(job.position)){
        await save(job);
      }
    });
    }
   
  } catch (err) {
    print(err);
  }
  
};



export default MalteserKrankenhaus_StAnna;