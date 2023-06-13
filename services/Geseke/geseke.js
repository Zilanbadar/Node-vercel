import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from  "../../utils/save.js";

let geseke = async (cluster,page, positions, levels) => {
  try {

    await page.goto(
      "https://dreifaltigkeits-hospital.de/geseke/ausbildung-karriere/aerztlicher-dienst/aktuelle-stellenangebote/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("a.btn.btn-default.btn-read-more")
      ).map((el) => el.href);
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
          let ttitle = document.getElementsByTagName("strong")[3];
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
          let lnk = document.querySelector("#c274 > p > a");
          return lnk ? lnk.href : "";
        });

        job.link = link;
       let email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/gi)|| 'N/A';
        });
        job.email = String() + email
        
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default geseke;
