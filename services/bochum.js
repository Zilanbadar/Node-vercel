import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let bochum = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.klinikum-bochum.de/karriere/stellenangebote.html?locations=9", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("h2 a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          city: "bochum",
          title: "",
          location: "",
          hospital: "St. Maria-Hilf-Krankenhau ",
          link: "",
          level: "",
          position: "",
          republic: " North Rhine-Westphalia",
          email: ""
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
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-. ]+@[a-zA-Z-. ]+/);
       
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
        }
        //
        // get location
        job.location = await page.evaluate(() => {
          let loc = document.querySelector(".first").innerText;
          //  loc = loc.replace("\n", " ");
          //  return loc.replace(/[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.].+/, "");
          return loc
        });
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
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector('.media-body a')
            return applyLink ? applyLink.href : ""
          })
          job.link = link;
        } else {
          job.link = jobLink
        }
   
         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
};


export default bochum;





