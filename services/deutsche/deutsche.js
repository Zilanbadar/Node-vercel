import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let deutsche = async (cluster,page,positions, levels) => {
  try {
    
    await page.goto(
      "https://koenigsfeld.deutsche-rentenversicherung-reha-zentren.de/subsites/Koenigsfeld/de/Navigation/Service/Stellenangebote/Stellenangebote_node.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
    //scroll the page
    await scroll(page);
    await page.waitForTimeout(1000);
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#content > div > div > div > table > tbody > tr > td:nth-child(1) > a"
        )
      ).map((el) => el.href);
    });
    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "58256 Ennepetal",
          hospital: "Klinik Konigsfeld",
          city: "Ennepetal",
          link: "",
          level: "",
          email: "",
          position: "",
          republic: "North Rhine-Westphalia",
        };
        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //get title
        let title = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("h1.isFirstInSlot")).map(
            (el) => el.innerText
          );
        });
        job.title = String() + title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+\@\w+\-\w+.\w+/) || "N/A";
        });
        job.email = String() + email;
        //apply link
        job.link = jobLink;
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

         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
         }
        
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default deutsche;
