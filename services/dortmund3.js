import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let dortmund3 = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto(
      "https://www.lukas-karriere.de/stellenangebote.html?term=&bereich=&einrichtung=16&abteilung=",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".job_title h3 a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          city: "dortmund",
          title: "",
          location: "Johannesstraße 9-17 44137 Dortmund",
          hospital: "St.-Johannes-Hospital Dor ",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          email: "bewerbung@lukas-gesellschaft.de",
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
        //get email
        job.email = await page.evaluate(() => {
          let emi = document.querySelector(".paper_mail.fa");
          return emi ? emi.innerText : "bewerbung@lukas-gesellschaft.de";
        });
     
     
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(
          /Facharzt|Chefarzt|Assistenzarzt/ | "Arzt" | "Oberarzt"
        );
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
          let app = document.querySelector(".online-bewerben a");
          return app ? app.href : null;
        });
        job.link = link;

        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector(".cell.breakword a");
            return applyLink ? applyLink.href : "";
          });
          job.link = link;
        } else {
          job.link = jobLink;
        }
         if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  
  } catch (e) {
    print(e);
  }
};


export default dortmund3;
