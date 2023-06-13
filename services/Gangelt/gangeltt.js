import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from  "../../utils/save.js";

let gangeltt = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto(
      "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=3",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks

    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.joboffer_title_text.joboffer_box > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          city: "Gangelt",
          hospital: "ViaNobis - Die Fachklinik",
          link: "",
          level: "",
          position: "",
          email: "",
          republic: " North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            "div.scheme-content.scheme-title > h1"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector("a.wpst");
          return eml ? eml.innerText : "";
        });
        job.email = email;
        //get location
        let location = await page.evaluate(() => {
          let loc = document.querySelector(".joboffer_maplink");
          return loc ? loc.innerText : "";
        });
        job.location = location;
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
        //applyLink
        let link = await page.evaluate(() => {
          let applyLink = document.querySelector("div.css_button > a");
          return applyLink ? applyLink.href : "";
        });
        job.link = link;
        if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
    
  } catch (e) {
    print(e);
  }
};

export default gangeltt;
