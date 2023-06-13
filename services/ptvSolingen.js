import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let ptvSolingen = async (cluster,page,positions,levels) => {
  try {

    let url = "https://ptv-solingen.de/blog/category/jobs/";
    await page.goto(url);
    await scroll(page);
    let jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("h2.entry-title.fusion-post-title a")
      ).map((el) => el.href);
    });;

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
      let job = {
        title: "",
        location: "Solingen",
        hospital: "Psychosoziale Trägerverein Solingen, Standort Eichenstraße",
        link: "",
        level: "",
        position: "",
        city:"Solingen",
        republic: "North Rhine-Westphalia",
        email: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1.entry-title");
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
    

      //get link
      let link = await page.evaluate(() => {
        let applyLink = document.querySelector(".post-content");
        return applyLink
          ? applyLink.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/)
          : "";
      });
        job.link = link;
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/)[0];
        })
      // console.log(job);
      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      });
    }
  
  } catch (e) {
    print(e);
  }
};


export default ptvSolingen;
