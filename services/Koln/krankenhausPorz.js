import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

const krankenhaus_porz = async (cluster,page, positions, levels) => {
    try {
        
    
        const jobLinks = [ ];
        let allUrls = [
            "https://www.khporz.de/de/meldungen-und-veranstaltungen/stellenausschreibungen.html"
            ]
            // all jobs links 
      for (let a = 0; a < allUrls.length; a++) {
        cluster.queue(async ({ page }) => {
          await page.goto(allUrls[a])
          scroll(page);
          let jobs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div.listable-list-item__content > p> a'))
              .map((el) => el.href);
          })
          jobLinks.push(...jobs)
        });
    }
    await page.waitForTimeout(3000);
        console.log(jobLinks);
    const details = [ ];
      for (let links of jobLinks) {
        cluster.queue(async ({ page }) => {
          let job = {
            title: "",
            location: "Köln",
            hospital: "Krankenhaus Porz am Rhein",
            link: "",
            level: "",
            position: "",
            republic: "North Rhine-Westphalia",
            city: "Köln",
            email: "",
          };
          scroll(page);
          await page.goto(links);
          const title = await page.evaluate(() => {
            let title = document.querySelector('div.content-body > h2')
            return title ? title.innerText : null
          })
          job.title = title;
    
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
  
          let email = await page.evaluate(() => {
            return document.body.innerText.match(/[A_Za-z0-9._+/-]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
          });
          if (typeof email == "object") {
            job.email = email;
          }
  
          job.link = links;
          await page.waitForTimeout(4000)
          if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
            await save(job);
          }
        }); 
    }
    } catch (err) {
        print(err);
    }
}

export default krankenhaus_porz;

