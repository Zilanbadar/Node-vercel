import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let MediaPark_Klinik = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.atos-karriere.de/stellenanzeigen/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("div.av-masonry-container.isotope > a")
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
          hospital: "MediaPark Klinik",
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
          let jbTitle = document.querySelector("h1.av-special-heading-tag");
          return jbTitle ? jbTitle.innerText : null
        });
      

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("#stellenanzeige > div > div > div > div > section > div")
          return loc ? loc.innerText.match(/A[A-Za-z0-9/,-_.]+.[A-Za-z0-9/,-_.]+.[A-Za-z0-9/,-_.]+.\n?.+.[A-Za-z0-9/,-_.]+.[A-Za-z0-9/,-_.]+.\n.[A-Za-z0-9/,-_.]+.[A-Za-z0-9/,-_.]+.[A-Za-z0-9/,-_.]+.\n/g) : "N/A";
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



export default MediaPark_Klinik;