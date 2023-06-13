import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
  

    await page.goto("https://www.augenklinik-moers.de/ueber-uns/karriere/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    await page.waitForSelector('.right a');
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".right a")
      ).map((el) => el.href);
    });
    //get titles
    let titles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".right h2")
        ).map(el => el.innerText);
      });
      console.log(titles)

    console.log(jobLinks);
    let allJobs = [];
    let counter = 0;
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Augenklinik Moers",
          link: "",
          level: "",
          position: "",
          city: "Moers",
          email: "",
          republic: "Dutch Republic",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
    
        job.title = titles[counter];
        counter++;
   
    

        job.location = await page.evaluate(() => {
      
          return document.body.innerText.match(/[a-zA-Z-.]+ \d+. \d+ [a-zA-Z-.]+|[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.].+|[a-zA-Z-.].+ \d+ .[\n]\d+ [a-zA-Z-.].+|[a-zA-Z-.].+ \d+[-.]\d+[\n]\w+.\d+ [a-zA-Z-.]+|[a-zA-Z-.]+ \w+ \d+[\n]\n\d+ [a-zA-Z-.].+/) || "Moers"
        
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
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+|[a-zA-Z-.]+[[]\w+.[a-zA-Z-.]+/) || "ed.ennedrad@relleum";
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
        }
        // job.email = email

        // get link 
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector('a.btn')
            return applyLink ? applyLink.href : ""
          })
          job.link = link;
        } else {
          job.link = jobLink
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

export default gfo_kliniken
