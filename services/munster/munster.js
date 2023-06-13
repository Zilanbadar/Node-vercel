import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let munster = async (cluster,page, positions,levels) => {
  try { 
    await page.goto("https://web.ukm.de/index.php?id=12978", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("#c66017 > div.news > div > div > div.content.articletype-0 > h3 > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    // let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Münster",
          hospital: "Universitätsklinikum Münster",
          link: "",
          level: "",
          position: "",
          republic: " North Rhine-Westphalia",
          city: "Münster",
          email: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("#c48515 > div > div > h1 > font > font");
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
        //get job links
        job.link = jobLink;
        let email = await page.evaluate(async () => {
          let eml = document.querySelector("#c66298 > div.textLayout.layoutNormal > div > p > a")
          return eml ? eml.innerText : 'N/A';
        });
        job.email = String() + email;
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
      print(job)
    }
  } catch (e) {
    print(e);
  }
};



export default munster;
