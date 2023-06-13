import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";



let krankenhausNeuwerk = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto("https://wirsuchenmenschen.de/jobs/?jq=neuwerk&city=M%C3%B6nchengladbach#mode-grid", {
      waitUntil: "load",
      timeout: 0,
    });
 page.setDefaultNavigationTimeout(0)
    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.title > a")
      ).map((el) => el.href);
    });

    let allJobs = [];
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "",
          hospital: "Krankenhaus Neuwerk \"Maria von den Aposteln\"",
          link: "",
          level: "",
          position: "",
          city: "Mönchengladbach",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });
        let title = await page.evaluate(() => {
          let jbtitle = document.querySelector('div.ce-bodytext > h1');
          return jbtitle ? jbtitle.innerText : null;
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          let loc = document.querySelector('p.icon-text.icon-location ').innerText;
          loc = loc.replace("\n", " ");
          return loc.replace(/\w+@\w+\.\w+/, "");
        });

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
          return document.body.innerText.match(/[a-zA-Z0-9_+/.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+/g);
        });
        if (typeof job.email == "object") {
          job.email = "" + job.email;
        };
        // apply Links 
        job.link = await page.evaluate(() => {
          let apply = document.querySelector('div.btn-group.job-links > a')
          return apply ? apply.href : null
        })
        await page.waitForTimeout(1000)
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
};




export default krankenhausNeuwerk;