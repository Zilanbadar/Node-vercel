import puppeteer from "puppeteer";
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let MutterKind_Klinik_UNIVIT = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto("https://www.univita.com/kur-und-vorsorge/ueber-uns-gut-holmecke/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);
  let jobLinks = [];
    //get all jobLinks
    const links = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("#content > ul:nth-child(4) > li > a")
      ).map((el) => el.href);
      return urls;
    });
    jobLinks.push(...links)
    const link2 = await page.evaluate(() => {
        let urls =  Array.from(
          document.querySelectorAll("#content > ul:nth-child(4) > li >span > a")
        ).map((el) => el.href);
        return urls;
      });
     jobLinks.push(...link2)
    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Mutter-Kind-Klinik UNIVIT",
          link: "",
          level: "",
          position: "",
          city: "Hemer",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let jbTitle = document.querySelector("div.jobs-row-input");
          return jbTitle ? jbTitle.innerText : null
        });
      

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("div.jobs-row.clearfix.position_job_location.type-location > div.jobs-row-input")
          return loc ? loc.innerText : "N/A";
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
          return document.body.innerText.match(/([a-zA-Z0-9_+./-]+\(\w+\)[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)|([a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)/) || "N/A";
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = "" + job.email;
        }

       if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
         await save(job);
       }
      });
      }
  } catch (err) {
    print(err);
  }
};






export default MutterKind_Klinik_UNIVIT;