import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let essenn = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto(
      "https://www.waz-leverkusen.de/stellenangebote_aerzte_fachpersonal.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks

    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a.joboffer_title")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: " Wuppere VAt Schusterinsel 1651379 Leverkusen",
          city: "Leverkusen",
          hospital:
            "Zentrum für Arbeitsmedizin und Arbeitssicherheit Rhein-Wupper e.V. Leverkusen",
          link: "",
          level: "",
          position: "",
          email: "",
          republic: " North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.joboffer_title");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector("div.x4_itemhtmlwrap > div > a");
          return eml ? eml.href.slice(7, -40) : "";
        });
        job.email = email;
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

        //applyLink
        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default essenn;
