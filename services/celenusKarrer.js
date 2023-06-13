import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let ugos_de = async (cluster,page,positions,levels ) => {
  try {

      let links = [
        'https://www.klinik-hilchenbach.de/karriere/',
        'https://www.celenus-karriere.de/jobs/aktuellejobs/aerzte/',
        'https://www.celenus-karriere.de/salvea/aktuellejobs/ aerzte/'
      ];

    let jobLinks = []
    let counter = 0
    do {
      cluster.queue(async ({ page }) => {
        await page.goto(links[counter], { timeout: 0 });
        scroll(page);
        // get all jobs links 
        let jobs = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll('.ce-bodytext > ul > li > a')
          ).map((el) => el.href)
        });
        jobLinks.push(...jobs)
      
        counter++;
        await page.waitForTimeout(3000);
      });
    } while (counter < links.length);
         
    

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "CELENUS Fachklinik Hilchenbach",
          link: "",
          level: "",
          position: "",
          city: "Hilchenbach",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });
      
        await page.waitForTimeout(1000);
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".nc-stelle-top > h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
  
    

        job.location = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/) || "Moltkestraße 27 77654 Offenburg"
        
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
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
        }
    
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector('.nc-action-button.nc-link-form a')
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
   
  } catch (e) {
    print(e);
  }
};

export default ugos_de;


