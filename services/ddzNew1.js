import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let ddz = async (cluster,page,positions,levels) => {
  try {
   

    let nextPage = true;
    let allJobLinks = [];
    await page.goto("https://ddz.de/karriere/#vacancies=tab_172_job/1", {
      waitUntil: "load",
      timeout: 0,
    });
    await page.waitForTimeout(3000);
    //wait for a while
    while (nextPage) {
      await scroll(page);
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".item > a")).map(
          (el) => el.href
        );
      });
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector(
          "#vacancies > div:nth-child(4) > div.nav > button:nth-child(2)"
        );
      });
      if (bottomNextLink) {
        await page.click(
          "#vacancies > div:nth-child(4) > div.nav > button:nth-child(2)"
        );
        nextPage = true;
      } else {
        nextPage = false;
      }
      allJobLinks.push(...jobLinks);
    }

    console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Deutsches Diabetes-Zentrum",
          link: "",
          level: "",
          position: "",
          city: "Düsseldorf",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //   let tit = 0;
        //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
   
        job.location = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[a-zA-Z-.ü].+ \d+[\n]\d+ [a-zA-Z-.ü]+/
            ) || ""
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
          return document.body.innerText.match(
            /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = jobLink;
        
           if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};


export default ddz;
