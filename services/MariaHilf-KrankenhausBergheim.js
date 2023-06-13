import save from "../utils/save.js";
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";

let MariaHilfKrankenhaus_Bergheim = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.maria-hilf-krankenhaus.de/ueber-uns/karriere/offene-stellen", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("a.accordion-title")
        ).map((el) => el.href);
      });
      

    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
      let job = {
        title: "",
        location: "Bergheim",
        hospital: "Maria-Hilf-Krankenhaus Bergheim",
        link: "",
        level: "",
        position: "",
        city: "Bergheim",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      await page.waitForTimeout(1000);

      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("a.accordion-title");
        return ttitle ? ttitle.innerText : "";
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
k
      job.email = await page.evaluate(() => {
        let mail = document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g);
        return mail || "N/A"
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = "" + job.email;
      }

      job.link = jobLink;
      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
    });
    }
   
  } catch (err) {
    print(err);
  }
  
};





export default MariaHilfKrankenhaus_Bergheim;