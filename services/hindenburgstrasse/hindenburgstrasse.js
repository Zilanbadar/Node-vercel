import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let hindenburgstrasse = async (cluster,page, positions,levels) => {
  try {
   
    await page.goto(
      "https://www.lukas-krankenhaus.de/de/unser-haus/index-stellenangebote.php",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h3.listEntryTitle > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Luisenhospital",
          hospital: "luisenhospital Aachen",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphelia",
          city: "Aachen",
          email:"",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            "div#anchor_5f6b2ef0_Famulanten--m-w-d-- > h2"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
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

        let link = await page.evaluate(() => {
          let apply = document.querySelector(
            "#blockContentFullRightInner > div.elementStandard.elementContent.elementContainerStandard.elementContainerStandard_var1.elementContainerStandardColumns.elementContainerStandardColumns2.elementContainerStandardColumns_var5050.wglAdjustHeightMax > div.col.col1 > div > div:nth-child(4) > a"
          );
          return apply ? apply.href : "";
        });
        job.link = link;
         job.email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
        });
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default hindenburgstrasse;
