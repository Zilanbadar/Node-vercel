import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let mariahilff = async (cluster,page, positions,levels) => {
  try {
  
    await page.goto(
      "https://berufe.mariahilf.de/karriere/#/~/audience/1005/jobs",
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
            document.querySelectorAll(
              "#content > div.overlay.ng-scope > div.slide-reveal.container.ng-scope > div > main > section > div.slide-reveal.col-xs-12.col-md-9.col-lg-9.ng-scope > div > article > article > ul.jobs > li> div > span.job-title > a"
            )
          ).map((el) => el.href);
        });
        allJobLinks.push(...jobLinks);

        await page.waitForTimeout(1000);
        let bottomNextLink = await page.evaluate(() => {
          return document.querySelector(
            "#content > div.overlay.ng-scope > div.slide-reveal.container.ng-scope > div > main > section > div.slide-reveal.col-xs-12.col-md-9.col-lg-9.ng-scope > div > div > div > div > li.pagination-next.ng-scope.disabled > a"
          );
        });
        if (bottomNextLink) {
          await page.click(
            "#content > div.overlay.ng-scope > div.slide-reveal.container.ng-scope > div > main > section > div.slide-reveal.col-xs-12.col-md-9.col-lg-9.ng-scope > div > div > div > div > li.pagination-next.ng-scope.disabled > a"
          );
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
          location: "41063 Moenchengladbach",
          hospital: "kliniken-mariahilf",
          city: "Moenchengladbach",
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
          let ttitle = document.querySelector("div.jobTitle > h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+.\w+\@\w+.\w+/) || "N/A";
        });
        job.email = String() + email;
        //apply link
        let link = await page.evaluate(() => {
          let lnk = document.querySelector(
            "body > div.container > div > div.sidebar.col-xs-12.col-sm-12.col-md-4 > div > div.apply.col-xs-12.col-sm-6.col-md-12 > div > a"
          );
          return lnk ? lnk.innerText : "N/A";
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


export default mariahilff;
