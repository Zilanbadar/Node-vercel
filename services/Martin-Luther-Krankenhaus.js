import save from "../utils/save.js";
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";


let MartinLuther_Krankenhaus = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.klinikum-bochum.de/karriere/stellenangebote.html?locations=21", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("div.job > h2  >a")
      ).map((el) => el.href);
      return urls;
    });

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "Bochum",
          hospital: "Martin-Luther-Krankenhaus",
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

        job.title = await page.evaluate(() => {
          let jbTitle = document.querySelector("div.mod_jobReader.block > h1");
          return jbTitle ? jbTitle.innerText : null
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
          return document.body.innerText.match(/([a-zA-Z0-9_+./-]+\(\w+\)[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)|([a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)/);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = jobLink;
        await page.waitForTimeout(2000);
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
    
  } catch (err) {
    console.error(err);
  }
};




export default MartinLuther_Krankenhaus;