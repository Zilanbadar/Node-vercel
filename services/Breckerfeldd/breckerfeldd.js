import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let breckerfeldd = async (cluster,page, positions, levels) => {
  try {
  
    await page.goto(
      "https://karriere.bethel.de/go/0000_Gesundheitsberufe/5101501/",
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
              "#job-table > div.pagination-top.clearfix > div > div > ul > li:nth-child(6) > a"
            )
          ).map((el) => el.href);
        });
        allJobLinks.push(...jobLinks);
        await page.waitForTimeout(1000);
        let bottomNextLink = await page.evaluate(() => {
          return document.querySelector("ul.pagination > li > a");
        });
        if (bottomNextLink) {
          await page.click("ul.pagination > li > a");
          nextPage = true;
        } else {
          nextPage = false;
        }
      });
    } //end of while loop
   

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Berlin-Lichtenberg, DE, 10365",
          hospital: "Homborner Werkstatt (WfbM)",
          city: "Breckerfeld",
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
          let ttitle = document.querySelector(
            "div.col-xs-12.fontalign-left > h1"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector("a");
          return eml ? eml.innerText.match(/\w+.\w+\[at\]\w+\-\w+.\w+/) : "";
        });
        job.email = String() + email;
        //apply link
        let link = await page.evaluate(() => {
          let lnk = document.querySelector(
            "a.btn.btn-primary.btn-large.btn-lg.apply.dialogApplyBtn"
          );
          return lnk ? eml.href : "";
        });
        job.link = link;

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
         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};


export default breckerfeldd;
