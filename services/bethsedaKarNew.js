import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let bethseda_karken = async (cluster,page,positions,levels) => {
  try {
    
            let jobLinks = []
            let allLinks = [
                "https://www.bethesda-krankenhaus-duisburg.de/karriere/%C3%A4rztlicher-dienst/"
            ]
            let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
        await page.goto(allLinks[counter], { timeout: 0 })
                
        await scroll(page)
        const links = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll('.j-module.n.j-text > ul > li a ')
          )
            .map(el => el.href)
        });
        // console.log(links)
        jobLinks.push(...links);
        counter++
      });
    } while (counter > allLinks.length);
            console.log(jobLinks)
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "Duisburg",
        hospital: "Evangelisches Krankenhaus BETHESDA zu Duisburg",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine-Westphalia",
        city: "Duisburg",
        email: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await scroll(page)

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h3");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      email = await page.evaluate(() => {
        return document.body.innerText.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi);
      });

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
      //get link
      let link = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-. ]+@[a-zA-Z-. ]+/);
       
      });

        job.link = link;

      if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
    });
    }
  } catch (e) {
    print(e);
  }
};


export default bethseda_karken;








