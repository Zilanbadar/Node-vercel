
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let stifiungTan = async (cluster,page,positions,levels) => {
  try {
 

    await page.goto(
      "https://stiftung-tannenhof-karriere.dvinci-easy.com/de/jobs",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    await page.waitForSelector("a.dvinci-job-position.ng-binding");
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("a.dvinci-job-position.ng-binding")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {

      cluster.queue(async({ page }) => {
      let job = {
        title: "",
        location: "Remschied",
        hospital:
          "Evangelische Stiftung Tannenhof - Fachkrankenhaus für Psychiatrie, Psychotherapie, Psychosomatik und",
        link: "",
        level: "",
        position: "",
        city: "Remscheid",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".default-design-box h1");
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


        job.link = jobLink;
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+@\w+\.\w+/);
        });
       if (typeof job.email === "object") {
        job.email = "N/A";
      }  

      if(positions.map(el => el.toLowerCase()).include(job.position.toLowerCase())){
        await save(job);
      }
    });

    }
 
  } catch (e) {
    print(e);
  }
};

export default stifiungTan;
