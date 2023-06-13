import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let Karrer_evkb = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto("https://karriere.evkb.de/stellenboerse.html?", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    await page.waitForSelector(".job-offer a");
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".job-offer a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Evangelisches Klinikum Bethel",
          link: "",
          level: "",
          position: "",
          city: "Bielefeld",
          email: "",
          republic: "North Rhine-Westphalia",
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
  
        job.location = await page.evaluate(() => {
          let loc = document.body.innerText.match(
            /Bi[A-Za-z]+ [A-Za-z]+|Bi[A-Za-z]+/
          );
          return loc;
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
     
        job.link = page.evaluate(() => {
          let Link = document.querySelector(
            "a.kein-mitarbeiter.button.btn.btn-default"
          );
          return Link ? Link.href : "";
        });
       
      job.link = jobLink;

        
          if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default Karrer_evkb;
