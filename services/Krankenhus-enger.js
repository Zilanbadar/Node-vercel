import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
    await page.goto(
      "https://www.krankenhaus-enger.de/khe/klinik/karriere.php",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h3 a")).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Evangelisches Krankenhaus Enger",
          link: "",
          level: "",
          position: "",
          city: "Enger",
          email: "",
          republic: "North Rhine-Westphalia",
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

        job.location = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[A-Za-z-.]+ \d+[\n]\d+ [A-Za-z]+|[A-Za-z-.]+ \d+[\n][\n]\d+ [A-Za-z]+|[A-Za-z-.ü]+ \d+. \d+ [A-Za-z-.ü]+/
            ) || "info@krankenhaus-enger.de"
          );
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
          return (
            document.body.innerText.match(
              /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
            ) || "gborsum@dbkg.de"
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};


export default gfo_kliniken;
