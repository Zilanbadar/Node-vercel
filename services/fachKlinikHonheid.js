import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let fachKlinikHon = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto(
      "https://fachklinik-hornheide.de/karriere/stellenmarkt/index_ger.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);
    let jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".jotitle > p a")).map(
        (el) => el.href
      );
    });
    console.log(jobLinks);
    await page.waitForTimeout(3000);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Fachklinik Hornheide",
          link: "",
          level: "",
          position: "",
          email: "",
          city: "Münster",
          republic: "North Rhine-Westphalia"
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
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });

        //get location 
        job.location = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/
          ) || "Münster"
        });
        if (typeof job.location == "object") {
          job.location = job.location[0];
        }
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
        //get email 
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z-. ]+@[a-zA-Z-. ]+|[a-zA-Z-. ]+[(]\w+[)][a-zA-Z-. ]+/
          )||"post @ fachklinik-hornheide.de";
        });
        if (typeof job.email == "object") {
          job.email = job.email[0];
        }
        

        //get applylink
        let link = await page.evaluate(() => {
          let links = document.querySelector(".btn.btn-primary");
          
          return links ? links.href : "";
        });
        job.link = link;
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default fachKlinikHon;
