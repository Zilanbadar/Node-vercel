import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let klinikLindenplatzDe = async (cluster,page,positions,levels) => {
  try {


    await page.goto(
      "https://rosenberg.deutsche-rentenversicherung-reha-zentren.de/subsites/Rosenberg/de/Navigation/04_Service/Stellenangebote/Stellenangebote_node.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".responsiveTable a")).map(
        (el) => el.href
      );
    });

    let jobLinksOO = [
      jobLinks[0],
      jobLinks[2],
      jobLinks[4],
      jobLinks[6],
      jobLinks[8],
    ];

    console.log(jobLinksOO);
    // console.log(jobLinksOO)
    // console.log("asas")
    let allJobs = [];

    for (let jobLink of jobLinksOO) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "Westphalia",
          hospital: "Klinik Rosenberg",
          link: "",
          level: "",
          position: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("#content h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
        //   console.log(title);

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
          level == "Assistenzarzt"
        ) {
          job.position = "artz";
        }
        if (position == "pflege" || (position == "Pflege" && !level in levels)) {
          job.position = "pflege";
          job.level = "Nicht angegeben";
        }


        let link = await page.evaluate(() => {
          let lnk = document.querySelector(".RichTextExtLinkMailTo.ExternalLink");
          return lnk ? lnk.href : " ";
        });
        job.link = link;
   
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};


export default klinikLindenplatzDe;
