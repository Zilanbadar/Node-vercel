import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let Krankenhaus_Wermelskirchen = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.krankenhaus-wermelskirchen.de/de/karriere/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let url =  Array.from(
        document.querySelectorAll("h2.listEntryTitle  > a")
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
          hospital: "Krankenhaus Wermelskirchen",
          link: "",
          level: "",
          position: "",
          city: "Wermelskirchen",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let ttitle = document.querySelector("div.elementStandard.elementContent.elementHeadline > h1");
          return ttitle ? ttitle.innerText : "";
        });

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("div.elementStandard.elementContent.elementBox.elementBox_var11 > div > div > div > p:nth-child(1)").innerText;
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
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  
  } catch (err) {
    console.error(err);
  }
  job.title = title;
};

export default Krankenhaus_Wermelskirchen;