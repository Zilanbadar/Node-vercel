import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const gutersloh = async(cluster,page, positions,levels) => {
  try {
   
    await page.goto("https://www.klinikum-guetersloh.de/beruf-und-karriere/stellenangebote/aerztlicher-dienst/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate( async() => {
      return Array.from(
        document.querySelectorAll("tbody > tr >th > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
 

    for (let jobLink of jobLinks) {
      cluster.queue( async({page})=>{
         let job = {
        title: "",
        location: "",
        hospital: "Hospital Gütersloh",
        link: "",
        level: "",
        position: "",
        city: "Gütersloh",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("#c400 > div > div > h1");
        return ttitle ? ttitle.innerText : "";
      });
      // job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector('div.tx-jppageteaser-pi1-list-entry-description')
        return loc ? loc.innerText.slice(50) : "";
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
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }

        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).include(job.position)) {
          await save(job);
        }
      });
    }
  } catch (error) {
      print(err);
    }
}
  
export default gutersloh;