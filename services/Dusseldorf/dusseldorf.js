import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from  "../../utils/save.js";

let dusseldorf = async (cluster,page, positions, levels) => {
  try {
   
    await page.goto(
      "https://www.uniklinik-duesseldorf.de/ausbildung-karriere/stellenangebote",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tx_brajobsukd > tbody > tr > td > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Geseke",
          hospital: "Hospital zum Hl. Geist Geseke",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Geseke",
          email: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".tx_brajobsukd > tbody > tr > td > font");
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
          let lnk = document.querySelector(".tx_brajobsukd > p > a");
          return lnk ? lnk.href : "";
        });
        job.link = link;
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) || 'N/A';
        })
        job.email = String() + email;

         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default dusseldorf;
