import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let anfahrt = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto(
      "https://psychiatrie.lwl-uk-bochum.de/die-klinik/stellenangebote",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("#parent-fieldname-text-9ce5adb0c3d949e589392a76920f2e78 > p > a")).map(el => el.href)
    });
    
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: " Anfahrt & Parken",
          hospital: "LWL University Hospital ",
          link: "",
          level: "",
          position: "",
          email: "",
          republic: "North Rhine-Westphalia",
          city: "Bochum",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.mainTitle");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
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
      
        let link = await page.evaluate(() => {
          let apply = document.querySelector("a.btn-apply")
          return apply ? apply.href : "";
        });
        job.link = link;

        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
        });

         if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};


export default anfahrt;