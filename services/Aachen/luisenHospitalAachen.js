import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

const luisenHospital_Aachen = async (cluster,page,positions, levels) =>{
    try {
       
       await page.goto(
           "https://stellen.luisenhospital.de/stellenangebote.html"
           );
        page.setDefaultNavigationTimeout(0);
       
        const jobLinks = [ ];
        let allUrls = [
            "https://stellen.luisenhospital.de/stellenangebote.html"
        ]
            // get all jobs links 
      for (let a = 0; a < allUrls.length; a++) {
        cluster.queue(async ({ page }) => {
          await page.goto(allUrls[a])
          scroll(page);
          let job = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div.joboffer_title_text.joboffer_box > a'))
              .map((el) => el.href);
          })
          jobLinks.push(...job)
        });
        }
    

        const alljobDetails = [ ];
      for (let details of jobLinks) {
        cluster.queue(async ({ page }) => {
          await page.goto(details)
          scroll(page)
          let job = {
            title: "",
            location: "Aachen ",
            hospital: "Luisenhospital Aachen ",
            link: "",
            level: "",
            position: "",
            republic: "North Rhine-Westphalia",
            city: "Aachen",
            email: "",
          };
          let title = await page.evaluate(() => {
            let jobTitle = document.querySelector('div.scheme-content.scheme-title h1');
            return jobTitle ? jobTitle.innerText : null
          })
          jobs.title = title;
           
          let applyLink = await page.evaluate(() => {
            let link = document.querySelector('div#btn_online_application > a');
            return link ? link.href : null
          })
          jobs.link = applyLink;
      
          let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
          let position = text.match(/arzt|pflege/);
          jobs.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt"
          ) {
            jobs.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            jobs.position = "pflege";
            jobs.level = "Nicht angegeben";
          }
           if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
        });
        }
    } catch (err) {
        print(err);
    }
}

export default luisenHospital_Aachen;