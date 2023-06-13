import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let MarienHospital_Erwitte = async (cluster,page,positions,levels) => {
  try {
  

    await page.goto("https://dreifaltigkeits-hospital.de/erwitte/ausbildung-karriere/aerztlicher-dienst/aktuelle-stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.col-md-3 > a")
        ).map((el) => el.href);
      });
      
      console.log(jobLinks);
    await scroll(page);
 // Get job Details
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
        let job = {
        title: "",
        location: "",
        hospital: "Marien-Hospital Erwitte",
        link: "",
        level: "",
        position: "",
        city: "Erwitte",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("span.big");
        return ttitle ? ttitle.innerText : "";
      });

      job.location = await page.evaluate(() => {
        let loc = document.querySelector(".news-text-wrap > p")
        // loc = loc.replace("\n", " ");
        return loc  ? loc.innerText.match(/\n.[a-zA-Z0-9_/.+-]+.[a-zA-Z0-9_/.+-]+.[a-zA-Z0-9_/.+-]+.[a-zA-Z0-9_/.+-]+.\n?.[a-zA-Z0-9_:/.+-]+.[a-zA-Z0-9_:/.+-]+.[a-zA-Z0-9_:/.+-]+.[a-zA-Z0-9_:/.+-]+.\n.[a-zA-Z0-9_:/.+-]+.[a-zA-Z0-9_:/.+-]+.[a-zA-Z0-9_:/.+-]+.[a-zA-Z0-9_:/.+-]+.\n.[a-zA-Z0-9_:/.+-]+.[a-zA-Z0-9_:/.+-]+./g) :  "N/A"
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
        let mail = document.querySelector('.news-text-wrap > p > a')
       return mail ?  mail.href.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g) : "N/A"
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }

      job.link = jobLink;
      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      });
      
    }
   
  } catch (err) {
    print(err);
  }
  
};



export default MarienHospital_Erwitte;