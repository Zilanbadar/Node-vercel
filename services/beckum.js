import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let beckum = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto(
      "https://www.krankenhaus-beckum.de/karriere/fuer-bewerber.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".media-body a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          city: "beckum",
          title: "",
          location: "beckum",
          hospital: "St. Elisabeth-Hospital beckum",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          email: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h2");
          return ttitle ? ttitle.innerText : null;
        });
        job.title = title;
        // get email
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z-. ]+[(]\w+[)][a-zA-Z-. ]+/
          );
        });

        // get location
        job.location = await page.evaluate(() => {
          let loc = document.querySelector("#c33970").innerText;
          loc = loc.replace("\n", " ");
          return loc.replace(/[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.].+/, "");
        });
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(
          /Facharzt|Chefarzt|Assistenzarzt/ | "Arzt" | "Oberarzt"
        );
        let position = text.match(/arzt|pflege/);
        job.level = level ? level[0] : "";
        if (
          level == "Facharzt" ||
          level == "Chefarzt" ||
          level == "Assistenzarzt"
        ) {
          job.position = "artz";
        }
        if (position == "pflege" || (position == "Pflege" && !level in levels)) {
          job.position = "pflege";
          job.level = "Nicht angegeben";
        }

        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector(".media-body a");
            return applyLink ? applyLink.href : "";
          });
          job.link = link;
        } else {
          job.link = jobLink;
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


export default beckum;
