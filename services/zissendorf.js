import print from "../utils/print.js";
import scroll from "../utils/scroll.js";
import save from "../utils/save.js";
let zissedorf = async (cluster,page,positions,levels) => {
  try {
  

    await page.goto("https://www.zissendorf.de/stellenanzeigen/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h2.entry-title a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
 let job = {
        title: "",
        location: "Gut Zissendorf, 53773 Hennef (Sieg), Germany",
        hospital: "Fachklink Gut Zissendorf",
        link: "",
        level: "",
        position: "",
        city: "Hennef, Sieg",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      // job.location = await page.evaluate(() => {
      //   let loc = document.querySelector(".sidebar-widget").innerText;
      //   loc = loc.replace("\n", " ");
      //   return loc.replace(/\w+@\w+\.\w+/, "");
      // });

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

      //get link\

      const email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/);
      });

        job.email = email;
        if (job.email == null) {
          job.email = "N/A";
        }

      // get link
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector(".box.arrow-box");
          return applyLink ? applyLink.href : "";
        });
        job.link = link;
      } else {
        job.link = jobLink;
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



export default zissedorf;
