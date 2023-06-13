import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let dusseldorf = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.koe-aesthetics.de/karriere/#d", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ".behandlungen-inhaltsverzeichnis__listing > a"
        )
      ).map((el) => el.href);
    });
   
    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
         let job = {
        title: "",
        location: "Schönheitschirurgie Düsseldorf | KÖ-Aesthetics",
        city: "Dusseldorf",
        hospital: "koe-aesthetics",
        link: "",
        email: "",
        level: "",
        position: "",
        republic: "Republic M! Deutschland GmbH",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      await page.waitForTimeout(1000);
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("div.block-content.text > h2");
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
        let applyLink = document.querySelector(
          ".behandlungen-inhaltsverzeichnis__listing > a"
        );
        return applyLink ? applyLink.href : null;
      });
      job.link = link;
      //get email
      let email = await page.evaluate(() => {
        let eml = document.querySelector(".footer-block");
        return eml ? eml.innerText.match(/\w+@\w+\-\w+.\w+/).toString() : null;
      });
        job.email = email;
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
     
    }
   
  } catch (e) {
    print(e);
  }
};

export default dusseldorf;
