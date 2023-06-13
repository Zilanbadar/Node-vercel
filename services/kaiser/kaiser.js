import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let kaiser = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto("https://www.kaiser-karl-klinik.de/klinik/stellenmarkt/", {
      waitUntil: "load",
      timeout: 0,
    });
    //scroll the page
    await scroll(page);

    await page.waitForTimeout(1000);
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("#main-inner > table > tbody > tr > td > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "53117 Bonn",
          hospital: "kaiser-karl",
          city: "Bonn ",
          link: "",
          level: "",
          email: "",
          position: "",
          republic: "North Rhine-Westphalia",
        };
        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //get title
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1#page-title");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector(
            "#sidebar-inner > div > p:nth-child(3) > a"
          );
          return eml ? eml.innerText : "N/A";
        });
        job.email = String() + email;
        //apply link
        job.link = jobLink;
        //get level
        let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
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

        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};

export default kaiser;
