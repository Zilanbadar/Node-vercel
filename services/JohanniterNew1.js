import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster, page,positions,levels) => {
  try {

    await page.goto(
      "https://www.johanniter.de/johanniter-kliniken/johanniter-krankenhaus-duisburg-rheinhausen/die-johanniter-ein-starker-arbeitgeber/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h3 > a")).map(
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
        hospital: "Johanniter-Krankenhaus Rheinhausen",
        link: "",
        level: "",
        position: "",
        city: "Duisburg",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".c-page-title > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        return (
          document.body.innerText.match(
            /[a-zA-Z-.ü]+ \d+-\d+. \d+ [a-zA-Z-.ü]+|[a-zA-Z-.ü].+ \d+[\n]\d+ [a-zA-Z-.ü]+|[a-zA-Z-.ü].+ \d+[\n][\n]\d+ [a-zA-Z-.ü]+/
          ) || "Kreuzacker 1-7, 47228 Duisburg, Germany"
        );
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
      

      job.email = await page.evaluate(() => {
        return (
          document.body.innerText.match(
            /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          ) || "info(at)do.johanniter-kliniken.de"
        );
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }
      // job.email = email

      // get link
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector(
            "a.c-button.c-button--main.c-button--large"
          );
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


export default gfo_kliniken;
