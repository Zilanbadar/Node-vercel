import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from  "../../utils/save.js";

let dusseldorfOne = async (cluster,page, positions, levels) => {
  try {
  
    await page.goto(
    "https://www.koe-aesthetics.de/karriere/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.behandlungen-inhaltsverzeichnis__listing > a")).map(el =>el.href)
    });
    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Düsseldorf",
          hospital: "koe-aesthetics",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Düsseldorf",
          email:"",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".block-content.text > h2");
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
          level == "Assistenzarzt"
        ) {
          job.position = "artz";
        }
        if (position == "pflege" || (position == "Pflege" && !level in levels)) {
          job.position = "pflege";
          job.level = "Nicht angegeben";
        }

        let link = await page.evaluate(() => {
          let lnk = document.querySelector("#scroll-up > section.behandlungen-block > div > div > div > div:nth-child(7) > p:nth-child(4) > a");
          return lnk ? lnk.href : "";
        });
        job.link = link;
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/gi);
        });

         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
         }
        
      });
    }
 
  } catch (e) {
    print(e);
  }
};

export default dusseldorfOne;
