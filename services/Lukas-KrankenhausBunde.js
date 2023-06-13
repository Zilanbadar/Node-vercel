import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let LukasKrankenhaus_Bunde = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto("https://www.lukas-krankenhaus.de/de/unser-haus/index-stellenangebote.php", {
      waitUntil: "load",
      timeout: 0,
    });


    //get all pagination links 
    await scroll(page);
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("a.listEntryMoreOnly")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
      let job = {
        title: "",
        location: "",
        hospital: "Lukas-Krankenhaus Bünde",
        link: "",
        level: "",
        position: "",
        city: "Bünde",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("#navigationBreadcrumb > div > div:nth-child(2) > a > span");
        return ttitle ? ttitle.innerText : "";
      });

      job.location = await page.evaluate(() => {
        let loc = document.querySelector("div#blockContentFullRightInner")
        // loc = loc.replace("\n", " ");
        return loc  ? loc.innerText.match(/Lu[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.\n?.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.\n?.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.\n.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+.[A-Za-z0-9,._+-/]+./g) :  "N/A"
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
        let mail = document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g);
        return mail || "N/A"
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }

      job.link = await page.evaluate ( () =>{
          let apply = document.querySelector('a.intern')
          return apply ? apply.href : null
      })
      if(positions.map(el => el.toLowerCase()).includes(job.position)){
        await save(job);
      }
    });
    }
    
  } catch (err) {
    print(err);
  }
  
};




export default LukasKrankenhaus_Bunde;