import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let drvKarriere = async (cluster,page,positions,levels) => {
  try {
    await page.goto(
      "https://jobs.drv-bund-karriere.de/stellenmarkt/?wpv-jobort=bad-salzuflen&wpv_aux_current_post_id=763&wpv_aux_parent_post_id=763&wpv_view_count=761",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("#wpv-view-layout-761 > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          city: "Bad Salzuflen",
          location: "Bad Salzuflen",
          hospital: "Rehabilitationsklinik",
          link: "",
          level: "",
          position: "",
          email: "thomas.nickel@drv-bund.de",
          republic:"North Rhine-Westphalia"
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".wpb_wrapper > h1");
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
        if (position == "pflege" || (position == "Pflege" && !level in levels)) {
          job.position = "pflege";
          job.level = "Nicht angegeben";
        }
       
        //get link
        job.link = await page.evaluate(() => {
          let link = document.querySelector(
            "#default-btn-c736e2b03394cb1914ff8e36269ca596"
          );
          return link ? link.href : "";
        });
     
        if (typeof link == "object") {
          job.link = link[0];
        }
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default drvKarriere;
