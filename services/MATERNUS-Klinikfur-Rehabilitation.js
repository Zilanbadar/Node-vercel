import save from "../utils/save.js";
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";

let MATERNUSKlinikfur_Rehabilitation = async (cluster, page, positions, levels) => {
  try {
    
    
    await page.goto("https://www.wirpflegen.de/karriere/stellenangebote/ort/bad-oeynhausen/v/liste/j/city/nw-Bad%2520Oeynhausen?cHash=0efd8abceef8ff54a7feac73f84f1516#joResults", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("div.item > p > strong > a")
      ).map((el) => el.href);
      return urls;
    });

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "MATERNUS-Klinik für Rehabilitation",
          link: "",
          level: "",
          position: "",
          city: "Bad Oeynhausen",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let jbTitle = document.querySelector("div.content-area > h1");
          return jbTitle ? jbTitle.innerText : null
        });
      

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("div.col-md-4.col-sm-4.col-xs-6.padding-top-xl.marginCol")
          return loc ? loc.innerText.slice(9, 96) : null;
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
          return document.body.innerText.match(/([a-zA-Z0-9_+./-]+\(\w+\)[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)|([a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)/);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = "" + job.email;
        }

        job.link = await page.evaluate(() => {
          let apply = document.querySelector("a.button-03")
          return apply ? apply.href : null;
        })
        await page.waitForTimeout(2000);
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
};


export default MATERNUSKlinikfur_Rehabilitation;