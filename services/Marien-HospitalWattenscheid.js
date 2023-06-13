import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let MarienHospital_Wattenscheid = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.klinikum-bochum.de/karriere/stellenangebote.html?locations=6", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".job > h2 > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);


    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
      let job = {
        title: "",
        location: "",
        hospital: "Marien-Hospital Wattenscheid",
        link: "",
        level: "",
        position: "",
        city: "Bochum",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".mod_jobReader.block > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector("span.locations > a")
        return loc ? loc.innerText  : null
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
        return document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/);
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }

      job.link = jobLink;

      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      })
    }
  } catch (e) {
    print(e);
  }
};


export default MarienHospital_Wattenscheid;
