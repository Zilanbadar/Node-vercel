import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let MediClinRobert_JankerKlinik = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://arbeiten-bei-mediclin.de/robert-janker-klinik/offene-stellen/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("div.content-text.content-element.text-center > p > a")
      ).map((el) => el.href);
      return urls;
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "",
          hospital: "MediClin Robert Janker Klinik",
          link: "",
          level: "",
          position: "",
          city: "Bonn",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let jbTitle = document.querySelector("div.scheme-content.scheme-title > h1");
          return jbTitle ? jbTitle.innerText : null
        });
      

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("ul.scheme-additional-data > li")
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

        job.link = await page.evaluate(() => {
          let apply = document.querySelector('div#btn_online_application > a')
          return apply ? apply.href : null
        })
        await page.waitForTimeout(2000);
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
};





export default MediClinRobert_JankerKlinik;