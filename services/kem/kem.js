import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let kem = async (cluster,page, positions, levels) => {
  try {
    await page.goto(
      "https://kem-med.com/ausbildung-und-karriere/karriere/stellenmarkt/pflege-funktionsdienst/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
    await scroll(page);
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.bite_main > p > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "44263 Dortmund",
          hospital: "Kath St.Paulus Gesellschaft",
          city: "Dortmund",
          link: "",
          level: "",
          email: "",
          position: "",
          republic: "North Rhine-Westphalia",
        };
        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //get title
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            "div.__bjp-content--block __bjp-border-section > h2"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
        });
        job.email = email;
        //apply link
        let link = await page.evaluate(() => {
          let lnk = document.querySelector("a.__bjp-btn");
          return lnk ? lnk.href : "N/A";
        });
        job.link = link;
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
         if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default kem;
