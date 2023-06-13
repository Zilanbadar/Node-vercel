import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let jobsEvkMet = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto("https://jobs.evk-mettmann.de/stellenangebote.html", {
      waitForTimeout: 0,
    });

    await page.waitForTimeout(1000);
    await scroll(page);

    // get all job links
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".joboffer_title_text.joboffer_box a")
      ).map((el) => el.href);
    });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Evangelisches Krankenhaus Mettmann",
          link: "",
          level: "",
          position: "",
          city: "Mettmann",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
        job.location = await page.evaluate(() => {
          let text = document.querySelector(".scheme-display");
          return text
            ? text.innerText.match(
              /[a-zA-Z]+ [|] [a-zA-Z]+. \d+.\d+ [|]. \d+ [a-zA-Z]+|[a-zA-Z]+. \d+-\d+  \d+ [a-zA-Z]+|[a-zA-Z]+. \d+.\d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+. \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+. \d+-\d+ \d+ [a-zA-Z]+/
            )
            : null;
        });

        if (typeof job.location == "object" && job.location != null) {
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

        job.email = await page.evaluate(() => {
          let text = document.querySelector("body");
          return  text.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/) || "datenschutz@evk-mettmann.de";
        });

        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        //   getting applylink
        let link = await page.evaluate(() => {
          let Link = document.querySelector(".css_button a");
          return Link ? Link.href : "";
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

export default jobsEvkMet;
