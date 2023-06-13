import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let badberleburgg = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.vamed-gesundheit.de/kliniken/bad-berleburg/unser-haus/karriere/stellenangebote/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
    let allJobs = [];
      //scroll the page
      await page.waitForTimeout(1000)
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("article.tabular-list__item > a")
        ).map((el) => el.href);
      });
  
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "57319 Bad Berleburg",
          hospital: "VAMED Klinik Bad Berleburg",
          city: "Bad Berleburg",
          link: "",
          level: "",
          email: "",
          position: "",
          republic: "North Rhine-Westphalia"
        };
        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });
    
        await page.waitForTimeout(1000);
        //get title
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.content-page-header__title");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
    
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+.\w+\d+\@\w+\-\w+.\w+/) || "N/A"
        })
        job.email = String() + email
        //apply link
        job.link = jobLink
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
    
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
            await save(job);
          }
      });

        }
       
      } catch (err) {
        print(err);
      }
    };
  
    export default badberleburgg;
