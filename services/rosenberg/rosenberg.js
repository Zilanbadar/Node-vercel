import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let rosenberg = async (cluster,page,positions,levels) => {
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
      return Array.from(document.querySelectorAll("td.odd > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "Rosenberge",
          city: " Bad Driburg",
          hospital: "klinik rosenberg",
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

        await page.waitForTimeout(2000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.isFirstInSlot");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector("#content");
          return eml
            ? eml.innerText.match(
              /[a-zA-Z0-9.-]+[@]+[a-zA-Z0-9.-]+[a-zA-Z0-9.-]+[a-zA-Z0-9.-]+/
            )
            : "";
        });
        job.email = String() + email;

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
   
  } catch (err) {
    print(err);
  }
};


export default rosenberg;
