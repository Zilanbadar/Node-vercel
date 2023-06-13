
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let Marien_HospitalMarl = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto("https://www.kkrn.de/karriere/stellenangebote/?tx_fmkarriere_karriere%5Bcontroller%5D=Frontend&cHash=796a5ee3c9f4e29f77c466195b1bb05c", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let hrefs = Array.from(
        document.querySelectorAll(".title > h2 > a")
      ).map((el) => el.href);
      return hrefs;
    });
      console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
 let job = {
        title: "",
        location: "Marl",
        hospital: "Marien-Hospital Marl",
        link: "",
        level: "",
        position: "",
        city: "Marl",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".stelle.clear > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      // job.location = await page.evaluate(() => {
      //   let loc = document.querySelector(".sidebar-widget").innerText;
      //   loc = loc.replace("\n", " ");
      //   return loc.replace(/\w+@\w+\.\w+/, "");
      // });

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
        let mail = document.body
         mail = mail.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g) 
        return mail || "N/A"
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }

      job.link = await page.evaluate( () => {
        let apply = document.querySelector('div.applynow > a.button')
        return apply ? apply.href : null
      })

      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      })
     
    }
   
  } catch (e) {
    print(e);
  }
};



export default Marien_HospitalMarl;
