import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let johanniterTwo = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto(
      "https://www.johanniter.de/johanniter-kliniken/johanniter-ordenshaeuser-bad-oeynhausen/werden-sie-teil-unseres-teams/",
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
          return Array.from(
            document.querySelectorAll("div.c-content-list__text > h3 > a")
          ).map((el) => el.href);
        });
        allJobLinks.push(...jobLinks);

        await page.waitForTimeout(1000);
        let bottomNextLink = await page.evaluate(() => {
          return document.querySelector(
            "#main-content > nav > ul > li.c-pagination__item.c-pagination__item--next-page > a"
          );
        });
        if (bottomNextLink) {
          await page.click(
            "#main-content > nav > ul > li.c-pagination__item.c-pagination__item--next-page > a"
          );
          nextPage = true;
        } else {
          nextPage = false;
        }
      });
    } //end of while loop

    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Hospitalers of the Order of St. John in Bad Oeynhausen",
          hospital: "johanniter",
          city: "Bad Oeynhausen ",
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
          let ttitle = document.querySelector("div.c-page-title > h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
        });
        job.email = String() + email;
        //apply link
        let link = await page.evaluate(() => {
          let lnk = document.querySelector(
            "a.c-button.c-button--main.c-button--large"
          );
          return lnk ? lnk.href : "N/A";
        });
        job.link = link;
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



export default johanniterTwo;
