import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let ugos_de = async (cluster,page,positions,levels) => {
  try {
  

    let url = [
      "https://www.ugos.de/karriere/caspar-heinrich-klinik",
      "https://www.ugos.de/karriere/caspar-heinrich-klinik/seite-2",
    ];

    let allJobLinks = [];
    let counter = 0;
    do {
      cluster.queue(async({ page }) => {
      await page.goto(url[counter], {
        waitUntil: "load",
        timeout: 0,
      });
      //wait for a while
      await page.waitForTimeout(1000);

      //scroll the page
      await scroll(page);

      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".articletype-0.jobs > h3 a")
        ).map((el) => el.href);
      });
      allJobLinks.push(...jobLinks);
      counter++;
    });
    } while (counter < url.length);
    print(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async({ page }) => {

      let job = {
        title: "",
        location: "Herten",
        hospital: "Gertrudis-Hospital Westerholt",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine-Westphalia",
        email:"",
      };

      await page.goto(jobLink);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
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
        let applyLink = document.querySelector("body");
        return applyLink
          ? applyLink.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/)
          : "";
      });

        job.link = link;
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/);
        });
        if (job.email == null) {
          job.email = "N/A";
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

export default ugos_de;


