import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let fachKlinik_h = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto(
      "https://fachklinik-hornheide.de/karriere/stellenmarkt/index_ger.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".jotitle > p a")).map(
        (el) => el.href
      );
    });

 
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Fachklinik Hornheide",
          link: "",
          level: "",
          position: "",
          city: "Hornheide",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("#jo h2");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/
          );
        });
        if (typeof job.location == "object") {
          job.location = job.location[0];
        }

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
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z-. ]+@[a-zA-Z-. ]+|[a-zA-Z-. ]+[(]\w+[)][a-zA-Z-. ]+/
          );
        });
        if (typeof job.email == "object") {
          job.email = job.email[0];
        }

        //   get link
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector(".btn.btn-primary");
          return applyLink ? applyLink.href : "";
        });

        job.link = link;

        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};



export default fachKlinik_h;
