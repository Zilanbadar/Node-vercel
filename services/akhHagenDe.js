import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let AkhHagen = async (cluster,page,positions,levels) => {
  try {
   
    let alljobsLinks = [];
    let allLinks = [
      "https://www.akh-hagen.de/karriere/stellenangebote#sr",
      "https://www.akh-hagen.de/karriere/stellenangebote/page/2?cHash=fe24ea08de7c02a724b2f538f77f0224#sr",
    ];

    let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
        
        await page.goto(allLinks[counter], { timeout: 0 });
        scroll(page);
        //get all job links
        //   await page.waitForSelector()
        let jobs = await page.evaluate(() => {
          return Array.from(document.querySelectorAll(".col-xs-12 > h4 a")).map(
            (el) => el.href
          );
        });
        alljobsLinks.push(...jobs);
        counter++;
        await page.waitForTimeout(3000);
      });
    } while (counter < allLinks.length);
    //console.log(allJobs);

    for (let jobLink of alljobsLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Hagen",
          hospital: "Agaplesion Allgemeines Krankenhaus Hagen",
          link: "",
          level: "",
          position: "",
          email: "",
          republic: "North Rhine-Westphalia",
          city:"Hagen",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".col-md-10.col-xs-12 h1");
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
       
        job.email = await page.evaluate(() => {
          let mail =document.querySelector(
            ".news-text-wrap.col-md-8.col-xs-12"
          );
          return mail
            ? mail.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/)
            : "";
        });
        job.link = jobLink;


        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
};


export default AkhHagen;
