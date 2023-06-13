import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let quellenhof = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto(
      "https://www.klinik-quellenhof.de/unsere-klinik/karriere/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks

    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.table-cell > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Kaiserstrasse 1459505 Bad Sassendorf",
          city: " Bad Sassendorf",
          hospital: "klinik-quellenhof",
          link: "",
          level: "",
          position: "",
          email: "",
          republic: " North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("div.text > h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector(".bw_contact");
          return eml
            ? eml.innerText.match(/[a-zA-Z]+[@]+[a-zA-Z.]+[a-zA-Z.]+/)
            : "";
        });
        job.email = String() + email;
        //get apply link
        let link = await page.evaluate(() => {
          let applylnk = document.querySelector("div.innerWrap > a");
          return applylnk ? applylnk.href : "";
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



export default quellenhof;
