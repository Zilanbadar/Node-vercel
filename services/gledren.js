import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let good = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto("https://www.gelderlandklinik.de/arbeit-karriere/stellenangebote-auf-dem-gesundheitscampus-geldern?tx_dg_stellenboerse_stellen%5Baction%5D=test&tx_dg_stellenboerse_stellen%5Bcontroller%5D=test&cHash=bbe5950cd222c16a790c630379b2054d", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".stelle a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      let job = {
        city:"Gelderland Clinic Geldern",
        title: "",
        location: "Clemensstraße 647608 Geldern",
        hospital: "Gelderland Clinic Clemensstrasse 10 47608 Geldern",
        link: "",
        level: "",
        position: "",
        republic:"North Rhine-Westphalia",
        email: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : null;
      });
      job.title = title;
  // get email
  job.email = await page.evaluate(() => {
    return document.body.innerText.match(/[a-zA-Z-. ]+[(][\w]+[)]\w+.\w+|[a-zA-Z-. ]+@\w+./);
   }); 
;
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/|"Arzt"|"Oberarzt");
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"
      ) {
        job.position = "artz";
      }
      if (position == "pflege" || (position == "Pflege" && !level in levels)) {
        job.position = "pflege";
        job.level = "Nicht angegeben";
      }

      let link = await page.evaluate(() => {
       let app = document.querySelector("#stellen-show > div.btn-toolbar > a.btn.online-formular.pull-right");
       return app ? app.href :null
      });
      job.link = link
              
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  
  } catch (e) {
    print(e);
  }
};



export default good;





