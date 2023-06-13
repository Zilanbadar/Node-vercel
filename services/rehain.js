import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let rehain = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto(
      "https://www.gfo-kliniken-rhein-berg.de/arbeit-karriere/stellenangebote.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".cell a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
      let job = {
        city: "Bergisch Gladbach",
        title: "",
        location:
          "GFO Kliniken Rhein-Berg inzenz-Pallotti-Str. 20 51429 Bergisch Gladbach-Bensberg",
        hospital: " GFO Kliniken Rhein-Berg",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine-Westphalia",
        email: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h2 strong");
        return ttitle ? ttitle.innerText : null;
      });
      job.title = title;
      // get email
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(
          /[a-zA-Z-. ]+[(][\w]+[)]\w+.\w+|[a-zA-Z-. ]+@[a-zA-Z-. ]+/
        );
      });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(
        /Facharzt|Chefarzt|Assistenzarzt/ | "Arzt" | "Oberarzt"
      );
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"
      ) {
        job.position = "artz";
      }
      if (position == "pflege" || (position == "Pflege" && !level in levels)) {
        job.position = "pflege";
        job.level = "Nicht angegeben";
      }

   
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector(".cell a");
          return applyLink ? applyLink.href : "";
        });
        job.link = link;
      } else {
        job.link = jobLink;
      }

      // get link
      let link = await page.evaluate(() => {
        return document.querySelector(
          "#tx_smsjobboerse_tabs_inhalt > div.inhaltbuttonrow > a.onlinebewerben.btn.btn--invert"
        ).href;
      });
      job.link = link;

      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
    });
    }
   
  } catch (e) {
    print(e);
  }
};



export default rehain;
