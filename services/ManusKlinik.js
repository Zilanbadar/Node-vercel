import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let Manus_Klinik = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.manus-klinik.de/karriere/#top", {
      waitUntil: "load",
      timeout: 0,
    });

      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.av-masonry-container.isotope > a")
        ).map((el) => el.href);
      });
      console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
      
      let job = {
        title: "",
        location: "MVZ Manus Clinic",
        hospital: "Manus Klinik",
        link: "",
        level: "",
        position: "",
        city: "Krefeld",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("h2.av-special-heading-tag");
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
        let mail = document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g);
        return mail || "N/A"
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }

      job.link = jobLink;
      allJobs.push(job);
      if(positions.map(el => el.toLowerCase()).include(job.position)){
        await save(job);
      }
    });
    }
   
  } catch (err) {
    print(err);
  }
  
};





export default Manus_Klinik;