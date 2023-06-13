import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let kpw = async (cluster,page, positions,levels) => {
  try {
    
    await page.goto("https://www.kpw.eu/karriere", {
      waitUntil: "load",
      timeout: 0,
    }); 
    await scroll(page);
    let jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "body > main > div > main > div > div.mainItemAjax > section.o-section.-padding.module-items-outer > div > div.moduleItems-element.moduleItems-content > div.moduleItems-items > a"
        )
      ).map((el) => el.href);
    });
    //end of while loop

    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "53127 Bonn",
          hospital: "Zentrum für Kinderheilkunde des Universitätsklinikums Bonn",
          city: "Bonn",
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
          let ttitle = document.querySelector("h1.headline");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector(
            "body > main > div > main > div > div.mainItemAjax > section.o-section.-padding.module-visual-statement.-offerdetail > div > div > div:nth-child(8) > div > p:nth-child(2) > a"
          );
          return eml ? eml.innerText : "N/A";
        });
        job.email = String() + email;
        //apply link
        job.link = jobLink;
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

        if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default kpw;
