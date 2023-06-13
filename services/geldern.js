import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let geldern = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto("https://www.clemens-hospital.de/arbeit-karriere/stellenangebote-auf-dem-gesundheitscampus-geldern", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("#paginate ul li a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          city: "geldern",
          title: "",
          location: "Clemensstraße 647608 Geldern ",
          hospital: "St.-Clemens-Hospital Geldern",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          email: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1");
          return ttitle ? ttitle.innerText : null;
        });
        job.title = title;
        job.title = title;
        // get email
        job.email = await page.evaluate(() => {
          let email1 = document.body.innerText.match(/[a-zA-Z-. ]+[(][\w]+[)]\w+.\w+|[a-zA-Z-. ]+@[a-zA-Z-. ]/);
          return email1 ? email1[0]: "";
        });
        // get location
        // job.location = await page.evaluate(() => {
        // let loc = document.querySelector(".arbeitsort").innerText;
        // return loc.match(/[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.].+/, "");
        // });
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/ | "Arzt" | "Oberarzt");
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
  
        // get link
        let link = await page.evaluate(() => {
          let app = document.querySelector("#stellen-show > div.btn-toolbar > a.btn.online-formular.pull-right");
          return app ? app.href : null
        });
        job.link = link
        // if (typeof link == "object") {
        //   job.link = link[0];
        // }
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
 
  } catch (e) {
    print(e);
  }
};

export default geldern;





