import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let munster = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto("https://www.hjk-muenster.de/karriere/stellenmarkt.html", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("h3.media-heading.hidden-xs > a")
      ).map((el) => el.href);
    });
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          city: "Münster",
          hospital: "Herz-Jesu-Krankenhaus Münster-Hiltrup",
          link: "",
          email: "",
          level: "",
          position: "",
          republic: "Irish republicans",
        };
        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });
        await page.waitForTimeout(1000);
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h2.news-heading");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });

        //get location
        let location = await page.evaluate(() => {
          let loc = document.querySelector("#c51415 > p:nth-child(2)");
          return loc ? loc.innerText.trim() : "";
        });
        job.location = location;
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
        //get email
        job.link = jobLink;
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector("div.article");
          return eml ? eml.innerText.match(/\w+\@\w+\-\w+.\w+/) : null;
        });
        job.email = String() + email;
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  
  } catch (e) {
    print(e);
  }
};

export default munster;
