import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let augestaKlinik = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto("https://www.augusta-kliniken.de/bildung-karriere/stellenangebote.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    await page.waitForSelector('a.full-link')
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("a.full-link")
      ).map((el) => el.href);
    });

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "",
          hospital: "Augusta-Kranken-Anstalt Bochum-Linden",
          link: "",
          level: "",
          position: "",
          city: "Bochum",
          email: "",
          republic: "Dutch Republic",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
    
        //get titles
        await page.waitForSelector("h1");
        let title = await page.evaluate(() => {
          return document.querySelector("h1").innerText;
        });
        job.title = title
        job.location = await page.evaluate(() => {
      
          return document.body.innerText.match(/[a-zA-Z-.].+ \d+. \d+ [a-zA-Z-.]+/) || "Moers"
        
        });

        if (typeof job.location == 'object' && job.location != null) {
          job.location = job.location[0]
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
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+|[a-zA-Z-.]+[[]\w+.[a-zA-Z-.]+/) || "";
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
        }
        // job.email = email

        // get link 
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector('a.btn.btn-primary-arrow')
            return applyLink ? applyLink.href : ""
          })
          job.link = link;
        } else {
          job.link = jobLink
        }
        if (positions.map(el => el.toLowerCase()).include(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};

export default augestaKlinik
