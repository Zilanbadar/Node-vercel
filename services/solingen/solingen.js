import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let solingen = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto(
      "https://jobs.diakonie-bethanien.de/jobs",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
    await scroll(page);

    //function for moving to next page
    await page.waitForTimeout(1000);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("ul.jobfeed > li > div > a")
        ).map((el) => el.href);
      });
    
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Aufderhöher Str. 16942699 Solingen",
          city: "Lengeoog",
          hospital: "diakonie-bethanien",
          link: "",
          email: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
        };
        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });
        await page.waitForTimeout(1000);
        // title
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("#tms-job-title > span > span > b:nth-child(2) > span > font:nth-child(1) > font");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
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
        if (
          position == "pflege" ||
          (position == "Pflege" && !level in levels)
        ) {
          job.position = "pflege";
          job.level = "Nicht angegeben";
        }
        await page.waitForSelector;
        let link = await page.evaluate(() => {
          let getLink = document.querySelector(".button-form");
          getLink.click();
          let applyLink = document.querySelector("a.button");
          return applyLink ? applyLink.href : null;
        });
        job.link = link;
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector(
            "#c101700 > div > section.content-block-list > div > article:nth-child(5) > div > div"
          );
          return eml
            ? eml.innerText.match(/\w+.\w+\@\w+\w+\-\w+.\w+/): "N/A";
        });
        job.email = String() + email;

        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    
     
    }
  } catch (e) {
    print(e);
  }
};


export default solingen;
