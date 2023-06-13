import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let kreisklinikumSiegen = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto(
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
      cluster.queue(async ({ page }) => {
      //scroll the page
      await scroll(page);

      await page.waitForTimeout(1000);
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("div.header > h3 > a")).map(
          (el) => el.href
        );
      });
      allJobLinks.push(...jobLinks);

      await page.waitForTimeout(1000);
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector("li.last.next > a");
      });
      if (bottomNextLink) {
        await page.click("li.last.next > a");
        nextPage = true;
      } else {
        nextPage = false;
      }
    });
    } //end of while loop

    console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {

        let job = {
          title: "",
          location: "57076 Siegen",
          hospital: "kreisklinikum-siegen",
          city: "Siegen ",
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
          let ttitle = document.querySelector("div.header > h3");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector(
            "#c5071 > div > div > div.news-text-wrap > p:nth-child(10) > a"
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


export default kreisklinikumSiegen;
