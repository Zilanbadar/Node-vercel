import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let eduardus_De1 = async (cluster,page,positions,levels) => {
  try { 
        await page.goto("https://eduardus.de/mitarbeit-karriere/fuer-bewerber/stellenmarkt/", { timeout: 0 })
        scroll(page)
       // await page.click('body > main > div.container-fluid.sortable > div > div.col-02-exclude > div > div.job-list.teaserbox > button')
    
        // getting all the links 
        const jobLinks = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll('a.card--btn')
          )
            .map(el => el.href)
        });
        // console.log(links)
      
            console.log(jobLinks)
   

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Köln",
          hospital: "Eduardus-Krankenhaus gGmbH",
          link: "",
          level: "",
          position: "",
          city: "Köln",
          republic: "",
          email: ""
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("p.kv--headline");
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
        
        // let link = await page.evaluate(() => {
        //   let applink = document.querySelector('.default--btn.fancy-formular')
        //   return applink ? applink.href : "";
        // });
        job.email = await page.evaluate(() => {
          let ttitle = document.body.innerText.match('/[a-zA-Z- ,]+@[a-zA-Z- ,]/') ||"mail@eduardus.de"
          return ttitle
        });
      

      
        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};



export default eduardus_De1;