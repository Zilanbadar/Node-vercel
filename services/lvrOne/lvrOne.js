import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let lvrOne = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto(
      "https://jobs.lvr.de/index.php?ac=search_result&search_criterion_division%5B%5D=42",
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
              "#content > main > form > div > div > div.jobboard-datatable.jobboard-widget > div > div.jb-datatable-list > table > tbody > tr > td > a"
            )
          ).map((el) => el.href);
        });
        allJobLinks.push(...jobLinks);

        await page.waitForTimeout(1000);
        let bottomNextLink = await page.evaluate(() => {
          return document.querySelector(
            "#pagination-container-bottom > li:nth-child(4) > a"
          );
        });
        if (bottomNextLink) {
          await page.click("#pagination-container-bottom > li:nth-child(4) > a");
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
          location: "Bedburg-Hau",
          hospital: " LVR Clinic Langenfeld",
          city: "Bedburg ",
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
          let ttitle = document.querySelector("h1.job-ad-header__title");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector(
            "#jobad > article > div > div.row.job-ad-facts > div.col-sm-6.col-md-5.job-ad-facts__column > ul > li:nth-child(3) > span > a"
          );
          return eml ? eml.innerText : "N/A";
        });
        job.email = String() + email;
        //apply link
        let link = await page.evaluate(() => {
          let lnk = document.querySelector(
            "a.btn.btn-lg.btn-block.btn-primary.js-button-apply.btn-apply-top"
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


export default lvrOne;
