import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";


let badDriburg = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto("https://www.kbs.de/DE/Jobboerse/Stellenangebote.html?nn=1086260&cl2Categories_Einrichtung=knappschaftsklinikbaddriburg&cl2Categories_Bundesland=nrw", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".text-wrapper a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Bad Driburg",
          hospital: "Knappschafts-Klinik Bad Driburg",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Bad Driburg",
          email:"",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".fliesstext h2");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
        //   console.log(title);

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
 
        //get link
        let link = await page.evaluate(() => {
          return document.body.innerText.match(/\w+.\w+@\w+.\w+/);
        });
        if (typeof link == "object") {
          job.link = link[0];
        }
        email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+@\w+-?\d+.\w+/) || "N/A";
        });
        job.email = String() + email
         if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    
    }
  
  } catch (e) {
    print(e);
  }
};

export default badDriburg;
