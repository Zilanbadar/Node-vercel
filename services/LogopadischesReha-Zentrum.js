import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let LogopadischesReha_Zentrum = async (cluster,page, positions,levels) => {
  try {

    await page.goto("https://www.logozentrumlindlar.de/das-zentrum/karriere/", {
      waitUntil: "load",
      timeout: 0,
    });


    //get all pagination links 
    await scroll(page);
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.x-accordion-inner > p > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Logopädisches Reha-Zentrum Lindlar",
          link: "",
          level: "",
          position: "",
          city: "Lindlar",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let ttitle = document.querySelector("div.entry-content.content > h5");
          return ttitle ? ttitle.innerText : "";
        });

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("p.Adresse").innerText;
          return loc || null
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
          return document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).include(job.position)) {
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
  
};



export default LogopadischesReha_Zentrum;