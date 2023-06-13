import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let betaKlinik = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto("https://www.betaklinik.de/beta-klinik/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".vc_custom_heading.vc_custom_1562575030398.vc_gitem-post-data.vc_gitem-post-data-source-post_title > h3 a"
        )
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Joseph-Schumpeter-Allee 15 53227 Bonn",
          hospital: "Beta Klinik",
          link: "",
          level: "",
          position: "",
          city: "Bonn",
          email: "",
          republic: "Bonn Republic",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {

          let ttitle = document.querySelector("h1");
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


        job.email = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
 
        job.link = jobLink;
         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  
  } catch (err) {
    print(err);
  }
};



export default betaKlinik;
