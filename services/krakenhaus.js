import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const krankenhausBethanien = async (cluster,page,positions,levels) => {
  try {
    let url = "https://jobs.diakonie-bethanien.de/jobs";
        await page.goto(url);
      await scroll(page);
      let jobLinks = await page.evaluate(() => {
        return [...document.querySelectorAll(".jobfeed-inner > a")].map(
          (el) => el.href
        );
      });

    let allJobs = [];
    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
         let job = {
        title: "",
        location: "Solingen",
        hospital: "Krankenhaus Bethanien ",
        link: "",
        level: "",
        position: "",
        email: "",
        city: "Solingen",
        republic: "North Rhine-Westphalia",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1#tms-job-title");
        return ttitle ? ttitle.innerText : null;
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
     //get link
      let link = await page.evaluate(() => {
        let link = document.querySelector("div#tms-action-editor > a");
        return link ? link.href : null;
      });
      job.link = link;
      let email = await page.evaluate(() => {
        return document.body.innerText.match(
          /[a-zA-Z0-9-._+/]+@[a-zA-Z0-9-._+/]+\.[a-zA-Z0-9-]+/
        );
      });
      if (typeof email == "object") {
        job.email = "" + email;
      }

      await save(job);
      });
     
    }
 
  } catch (err) {
    print(err);
  }
};

export default krankenhausBethanien;
