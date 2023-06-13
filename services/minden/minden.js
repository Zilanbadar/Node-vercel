import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let minden = async (cluster, page, positions, levels) => {
  try {

    await page.goto(
      "https://www.muehlenkreiskliniken.de/muehlenkreiskliniken/karriere/stellenangebote",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".career-overview-item")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);


    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Munester",
          hospital: "Herz-Jesu-Krankenhaus Munester",
          link: "",
          level: "",
          position: "",
          email: "",
          republic: " North Rhine-Westphalia",
          city: "Munester",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h2");
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
          let lnk = document.querySelector("div.container > a");
          return lnk ? lnk.href : "";
        });
        job.link = link;
        //get email
        let email = await page.evaluate(async () => {
            return  document.body.innerText.match(/\w+\(\w+\)\w+.\w+/) || "N/A"
           });
           job.email = String()+ email;


        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }

  } catch (e) {
    print(e);
  }
};

export default minden;
