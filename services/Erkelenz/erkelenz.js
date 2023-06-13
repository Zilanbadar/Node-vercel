import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from  "../../utils/save.js";

let erkelenz = async (cluster,page, positions, levels) => {
  try {
   
    await page.goto(
      "https://www.hjk-erkelenz.de/Mitarbeiter-Karriere-Ausbildung/Karriere/Offene-Stellen",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.headline > h3 > a")).map(
        (el) => el.href
      );
    });
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          city: "Erkelenz",
          hospital: "Hermann-Josef-Krankenhaus Erkelenz",
          link: "",
          email: "",
          level: "",
          position: "",
          republic: "Rhenish Republic",
        };
        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });
        await page.waitForTimeout(1000);
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            "body > div.container.p-b-25 > div > div.col-md-9 > div:nth-child(1) > div:nth-child(1) > h1"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });

        //get location
        let location = await page.evaluate(() => {
          let loc = document.querySelector(
            "body > footer > div > div > div.col-md-3 > p:nth-child(2)"
          );
          return loc ? loc.innerText.trim() : "";
        });
        job.location = location;
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
        let link = await page.evaluate(() => {
          let applyLink = document.querySelector("div.col-md-12.pt-20.mb-50 > a");
          return applyLink ? applyLink.href : null;
        });
        job.link = link;
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector("a.spamspan");
          return eml ? eml.innerText.toString() : null;
        });
        job.email = email;
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};
export default erkelenz;
