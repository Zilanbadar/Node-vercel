import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.cardioclinic-koeln.de/cardioclinic-koeln/stellenausschreibungen", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("body > div.container-fluid.container-extra-wide.content-container > div > div > div > div:nth-child(2) > section > div > div.csc-textpic.csc-textpic-center.csc-textpic-above > div > ul > li > a")
      ).map((el) => el.href);
    });
    let titles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("body > div.container-fluid.container-extra-wide.content-container > div > div > div > div:nth-child(2) > section > div > div.csc-textpic.csc-textpic-center.csc-textpic-above > div > ul > li > a")
        ).map(el => el.innerText)	
      });
    let counter = 0
    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "CardioClinic Köln",
          link: "",
          level: "",
          position: "",
          city: "Köln",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

     
        job.title = titles[counter];
        counter++

        job.location = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-.ßö]+ \d+ [\n]\d+ [a-zA-Z-.ßö]+/) || "Buchforststraße 2 51103 Köln";
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
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) || ""
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
        }
        // job.email = email

        // get link 
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector('a.onlineBewerben')
            return applyLink ? applyLink.href : ""
          })
          job.link = link;
        } else {
          job.link = jobLink
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


export default gfo_kliniken;