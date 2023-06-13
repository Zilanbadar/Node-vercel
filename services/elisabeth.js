import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://elisabeth-klinik.de/elisabeth-klinik/jobs-karriere/stellenmarkt/", {
      waitUntil: "load",
      timeout: 0,
    });

    // await page.waitForSelector('tbody > tr > td > a')
    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("a.card--btn")
      ).map((el) => el.href);
    });
      let counter = 0;
    //   if(tit){
      let titles = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("h3.card--title")
          ).map(el => el.innerText)
      });
    console.log(jobLinks);
    

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        
        let job = {
          title: "",
          location: "",
          hospital: "Elisabeth-Klinik Bigge",
          link: "",
          level: "",
          position: "",
          city: "Olsberg",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
    
        job.title = titles[counter];
        counter++

        job.location = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/) || "Elisabeth Clinic in Bigge (Olsberg)";
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
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) || "info@elisabeth-klinik.de"
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
        }


        // get link 
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector('a.btn.apply')
            return applyLink ? applyLink.href : ""
          })
          job.link = link;
        } else {
          job.link = jobLink
        }
        
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
    
  } catch (err) {
    print(err);
  }
};


export default gfo_kliniken;
