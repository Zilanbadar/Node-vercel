import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let karriereJohanneswerk = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto("https://karriere.johanneswerk.de/stellenboerse.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tx_jobfair a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Käthe-Kollwitz-Haus",
          hospital: "Evangelisches Johanneswerk",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Käthe-Kollwitz-Haus",
          email:""
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".tx_jobfair h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
        // console.log(title)

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

        let link = await page.evaluate(() => {
          let link1 = document.querySelector("#checkOutButton a");
          return link1 ? link1.href : "";
        });
        // apply Links
        job.link = link;
         let email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
         });
        job.email = email;
         if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
 
  } catch (e) {
    print(e);
  }
};


export default karriereJohanneswerk;
