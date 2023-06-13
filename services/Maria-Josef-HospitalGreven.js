import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";



let MariaJosef_HospitalGreven = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.maria-josef-hospital.de/karriere/stellenmarkt.html", {
      waitUntil: "load",
      timeout: 0,
    });

      let jobLinks = await page.evaluate(() => {
        let url =  Array.from(
          document.querySelectorAll("h3.media-heading.visible-xs > a")
        ).map((el) => el.href);
        let urls = Array.from(
            document.querySelectorAll("p.pull-right > a")
          ).map((el) => el.href);
          return url || urls;
      });
      console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({page})=>{
      let job = {
        title: "",
        location: "",
        hospital: "Maria-Josef-Hospital Greven",
        link: "",
        level: "",
        position: "",
        city: "Greven",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      await page.waitForTimeout(1000);

      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("h2.news-heading");
        return ttitle ? ttitle.innerText : "";
      });

      job.location = await page.evaluate(() => {
        let loc = document.querySelector("div.frame.frame-type-text.frame-layout-0.ce-default.col-xs-12")
        // loc = loc.replace("\n", " ");
        return loc  ? loc.innerText.slice(18,-60) :  "N/A"
      });

      if (typeof job.location == "object" && job.location != null) {
        job.location = job.location[0];
      }
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

      job.email = await page.evaluate(() => {
        let mail = document.body.innerText.match(/([a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-])|([a-zA-Z0-9_/-]+\(\w+\)[a-zA-Z0-9_/-]+\.[a-zA-Z0-9_/-]+)+/g);
        return mail || "N/A"
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = "" + job.email;
      }

      job.link = jobLink;
      if(positions.map(el => el.toLowerCase()).include(job.position)){
        await save(page);
      }
    });
    }
  } catch (err) {
    print(err);
  }
  
};







export default MariaJosef_HospitalGreven;