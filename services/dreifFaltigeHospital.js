import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {

    await page.goto(
      "https://dreifaltigkeits-hospital.de/ausbildung-karriere/aerztlicher-dienst/aktuelle-stellenangebote/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    await page.waitForSelector(".btn.btn-default.btn-read-more");
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".btn.btn-default.btn-read-more")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Dreifaltigkeits-Hospital",
          link: "",
          level: "",
          position: "",
          city: "Lippstadt",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //   let tit = 0;
        //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            "#c273 > div > div > div.news-text-wrap > p > span.big"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[a-zA-Z-.ü].+ \d+[\n]\d+ [a-zA-Z-.üß]+/
            ) || ""
          );
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

        job.email = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
            ) || "gborsum@dbkg.de"
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
      
        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
    print(allJobs);
    await save(allJobs.filter((job) => positions.indexOf(job.position) >= 0));
  } catch (e) {
    print(e);
  }
};



export default gfo_kliniken;
