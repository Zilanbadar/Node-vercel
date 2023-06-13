import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from  "../../utils/save.js";

let KoAesthetics_Dusseldorf = async (cluster,page, positions, levels) => {
  try {
 
    await page.goto("https://www.koe-aesthetics.de/karriere.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.behandlungen-inhaltsverzeichnis__listing > a")
      ).map((el) => el.href);
    });

    //console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Kö-Aesthetics Düsseldorf",
          link: "",
          level: "",
          position: "",
          city: "Düsseldorf",
          email: "",
          republic: " North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector('div.block-content.text > h2')
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          let loc = document.querySelector('address').innerText;
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
          return document.body.innerText.match(/[a-zA-Z0-9/_.-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9]/);
        });
        if (typeof job.email == "object") {
          job.email = "" + job.email
        }

        job.link = jobLink;
         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};



export default KoAesthetics_Dusseldorf;