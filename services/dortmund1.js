import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let dortmund1 = async (cluster,page,positions,levels) => {
  try {
    let urls = ["https://www.karriere-johannes.de/jobs.html?term=&bereich=&einrichtung=1",
      "https://www.karriere-johannes.de/jobs.html?term=&bereich=&einrichtung=1&page_n15=2"];
    let allLinks = [];
    for (let url of urls) {
      cluster.queue(async (page) => {
      
        await page.goto(url, { waitUntil: "load", timeout: 0, });

        await scroll(page);

        //get all jobLinks
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("h2 a")).map((el) => el.href);
        });
        allLinks.push(links);
      });
    }


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
        //get email
        job.email = await page.evaluate(() => {
          return document.querySelector(".paper_mail.fa").innerText;
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



export default dortmund1;
