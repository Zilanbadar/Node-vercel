import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let KrankenhausPorz_amRhein = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto("https://www.khporz.de/de/meldungen-und-veranstaltungen/stellenausschreibungen.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let url =  Array.from(
        document.querySelectorAll("div.listable-list-item__content >  h2 > a")
      ).map((el) => el.href);
      return url 
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Krankenhaus Porz am Rhein",
          link: "",
          level: "",
          position: "",
          city: "Köln",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let ttitle = document.querySelector("div.content-body > h2");
          return ttitle ? ttitle.innerText : "";
        });

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("address > div > div > div > p:nth-child(1)").innerText;
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
          return document.body.innerText.match(/[a-zA-Z0-9_+-./]+@[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).include(job.positions.toLowerCase())) {
          await save(job);
        }
      });
    }
  
  } catch (err) {
    print(err);
  }
};






export default KrankenhausPorz_amRhein;