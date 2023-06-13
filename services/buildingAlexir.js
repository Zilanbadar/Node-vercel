import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let ddz = async (cluster,page,positions,levels) => {
  try {

    let allJobLinks = [];
    await page.goto(
      "https://bildung.alexianer.de/LC/6/2046671275/OBS/UebersichtStandard",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
    let allPages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".pagination > li")).length;
    });
    for (let i = 1; i <= allPages; i++) {
      let next = await page.evaluate(() => {
        return document.querySelector(".paginate_button.next");
      });
      if (next) {
        cluster.queue(async({ page }) => {
        await page.click(".paginate_button.next");
        await page.waitForTimeout(1000);
        scroll(page);
        let jobs = await page.evaluate(() => {
          return [
            ...document.querySelectorAll("a.openItem.jsDatatableOeffneZeile"),
          ].map((a) => a.href);
        });
          allJobLinks.push(...jobs);
        });
      } else {
        break;
      }
    }
    console.log(allJobLinks);
    let allJobs = [];
    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Alexianer Krankenhaus Aachen",
          link: "",
          level: "",
          position: "",
          city: "Aachen",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            ".obsInformation__innerWrapper > h1"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          return document.querySelector("span.obsInformation__stelleOrt ")
            .innerText;
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
            ) || " I.Hauth@alexianer.de"
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
        // job.email = email

        // get link
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector(
              "a.btn.btn--akzent1.btn-lg.btn-block"
            );
            return applyLink ? applyLink.href : "";
          });
          job.link = link;
        } else {
          job.link = jobLink;
        }
         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
    print(allJobs);
    await save(allJobs.filter((job) => positions.indexOf(job.position) >= 0));
  } catch (e) {
    print(e);
  }
};


export default ddz;
