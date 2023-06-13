import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let KrankenhausMara = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://karriere.evkb.de/stellenboerse.html?stadt=1", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.job-offer > a"))
      .map((el) => el.href);
    });
await page.waitForTimeout(2000)
    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Krankenhaus Mara",
          link: "",
          level: "",
          position: "",
          city: "Bielefeld",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector('header >  h1')
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          let loc = document.querySelector('div.col-12.col-lg-3.jobInfoFacts > p:nth-child(3)').innerText;
          loc = loc.replace("\n", " ");
          return loc.replace(/\w+@\w+\.\w+/, "");
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
        if (typeof job.email == "object") {
          job.email = "" + job.email
        }
        let link = await page.evaluate(() => {
          let apply = document.querySelector('a.kein-mitarbeiter.button.btn.btn-default')
          return apply ? apply.href : null;

        })
        job.link = link;
      
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default KrankenhausMara;