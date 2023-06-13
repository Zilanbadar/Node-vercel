import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let kathrana_kathe = async (cluster,page,positions,levels) => {
  try {
    
    
    
    let url = "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=16";
    await page.goto(url, {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
   const links = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".joboffer_title_text.joboffer_box a")
        ).map((el) => el.href);
      });

    for (let link of links) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Wesseling",
          hospital: "Dreifaltigkeits-Krankenhaus Wesseling",
          link: "",
          level: "",
          position: "",
        };

        await page.goto(link, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            ".scheme-content.scheme-title > h1"
          );
          return ttitle ? ttitle.innerText : "";
        });
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
        
        job.link = link;
          if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
        
      });
    }
  } catch (e) {
    print(e);
  }
};

export default kathrana_kathe;
