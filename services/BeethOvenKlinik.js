import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.beethoven-klinik-koeln.de/karriere/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    await page.waitForSelector("h2.entry-title a")
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("h2.entry-title a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "beethoven 5-13 Klinik-Köln",
          link: "",
          level: "",
          position: "",
          city: "Köln",
          email: "",
          republic: "Czech Republic",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.entry-title");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
  
        job.location = await page.evaluate(() => {
          let loc = document.querySelector(".row");
          return loc ? loc.innerText.match(/[a-zA-Z-.öß]+ \d+.\d+[\n]\d+ [a-zA-Z-.öß]+/) : ""
        
        });

        if (typeof job.location == 'object' && job.location != null) {
          job.location = job.location[0]
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
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
        }
     
        job.link = jobLink
 
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
            await save(job);
          }
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default gfo_kliniken
