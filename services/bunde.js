import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let bunde = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto(
      "https://www.kreis-herford.de/KREIS-HERFORD/Stellenangebote-und-Karriere-machen/Stellenangebote-Online-Bewerbungsportal/Stellenangebote",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".real_table td a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          city: "bunde",
          title: "",
          location: "",
          hospital: "Sozial-Psychiatrische Rehab",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          email: "bewerbung@lukas-gesellschaft.de",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".block > h1");
          return ttitle ? ttitle.innerText : null;
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(
          /Facharzt|Chefarzt|Assistenzarzt/ | "Arzt" | "Oberarzt"
        );
        let position = text.match(/arzt|pflege/);
        job.level = level ? level[0] : "";
        if (
          level == "Facharzt" ||
          level == "Chefarzt" ||
          level == "Assistenzarzt"
        ) {
          job.position = "artz";
        }
        if (position == "pflege" || (position == "Pflege" && !level in levels)) {
          job.position = "pflege";
          job.level = "Nicht angegeben";
        }
     
        let link = await page.evaluate(() => {
          return document.querySelector("#btn_online_application > a").href;
        });
        job.link = link;
    
         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
    
  } catch (e) {
    print(e);
  }
};


export default bunde;
