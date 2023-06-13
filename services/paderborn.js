import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let octapharmp = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto("https://karriere.johannisstift.de/stellenangebote.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".subpages-abstract a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
      let job = {
        city: "paderborn",
        title: "",
        location: "Reumontstraße 28 33102 Paderborn",
        hospital: "St. Johannisstift Paderborn",
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
        let ttitle = document.querySelector("h3");
        return ttitle ? ttitle.innerText : null;
      });
      job.title = title;
      // get email
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(
          /[a-zA-Z-. ]+[(][\w]+[)]\w+.\w+|[a-zA-Z-. ]+@[a-zA-Z-. ]+/
        );
      });
        if (typeof job.email == "object") {
          job.email = job.email[0];
        }

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(
        /Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/
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
          let applyLink = document.querySelector(".grau-container a");
          return applyLink ? applyLink.href : "";
        });
        job.link = link;
      } else {
        job.link = jobLink;
      }

      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
    });
    }
  } catch (e) {
    print(e);
  }
};

export default octapharmp;
