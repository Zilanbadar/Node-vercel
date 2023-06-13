import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let kempen = async (cluster,page, positions, levels) => {
  try {
    await page.goto(
      "https://www.krankenhaus-kempen.de/karriere/stellenangebote",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.headline > h3 > a")).map(
        (el) => el.href
      );
    });

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Kempen",
          hospital: "Hospital zum Heiligen Geist Kempen",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphelia",
          city: "Kempen",
          email: "",
        
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h3");
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
          let lnk = document.querySelector("div.col-md-12 > a");
          return lnk ? lnk.href : "";
        });
        job.link = link;
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
        });
        job.email = email;
        
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default kempen;

