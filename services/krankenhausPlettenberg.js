import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let krankenhausPlettenberg = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.radprax.de/leistungen/", {
      waitUntil: "load",
      timeout: 0,
    });
 page.setDefaultNavigationTimeout(0)
    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.link > a"))
      .map((el) => el.href);
    });
//   await page.waitForTimeout(2000)
    console.log(jobLinks)
    let allJobs = [];
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "",
          hospital: "Krankenhaus Plettenberg",
          link: "",
          level: "",
          position: "",
          city: "Plettenberg",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });
        let title = await page.evaluate(() => {
          let jbtitle = document.querySelector('header > h2');
          return jbtitle ? jbtitle.innerText : null;
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          let loc = document.querySelector('div.frame.frame-default.frame-type-text.frame-layout-0 > p:nth-child(7)')
          return loc ? loc.innerText : null
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
          return document.body.innerText.match(/[a-zA-Z0-9_+/.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+/g);
        });
        if (typeof job.email == "object") {
          job.email = "" + job.email;
        };
        // apply Links 
        job.link = jobLink;
        await page.waitForTimeout(1000)
        if (positions.map(el => el.toLowerCase()).include(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
} catch (err) {
    print(err);
  }
};



export default krankenhausPlettenberg;