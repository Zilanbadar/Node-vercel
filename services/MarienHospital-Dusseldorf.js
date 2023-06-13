import puppeteer from "puppeteer";
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";

let MarienHospital_Dusseldorf = async (cluster,page, positions, levels) => {
  try {

    await page.goto("https://www.karriere-johannes.de/jobs.html?term=&bereich=&einrichtung=3", {
      waitUntil: "load",
      timeout: 0,
    });

      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.layout_teaser.block > h2 > a")
        ).map((el) => el.href);
      });
      
      console.log(jobLinks);
    await scroll(page);

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) => {
          let job = {
        title: "",
        location: "Dortmund",
        hospital: "Marien Hospital Dortmund",
        link: "",
        level: "",
        position: "",
        city: "Dortmund",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1.title");
        return ttitle ? ttitle.innerText : "";
      });
     
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
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
        
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      } else if (job.email == null) {
        return job.email = "N/A";
      }
      job.link = await page.evaluate ( () => {
        let apply = document.querySelector('p.online-bewerben.link > a')
        return apply ? apply.href : null;
      })
      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      });
    
    }
  } catch (err) {
    print(err);
  }
  
};





export default MarienHospital_Dusseldorf;