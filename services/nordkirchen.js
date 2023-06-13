import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let nordkirchen = async (cluster,page,positions,levels) => {
  try {
      await page.goto(
      "https://karriere.vck-gmbh.de/stellenangebote.html?filter%5Bclient_id%5D%5B%5D=3",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#joboffers > div > div.joboffer_title_text.joboffer_box > a"
        )
      ).map((el) => el.href);
    });

    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "59394 Nordkirchen",
        hospital: "Vestische Caritas-Kliniken GambH",
        city: "Nordkirchen",
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
        return (
          document.body.innerText.match(/\w+.\w+\(\w+\)\w+.\w+\-\w+.\w+/) ||
          "N/A"
        );
      });
      job.email = String() + email;
      //apply link
      let link = await page.evaluate(() => {
        let lnk = document.querySelector("#btn_online_application > a");
        return lnk ? lnk.href : "";
      });
      job.link = link;
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

      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
    });
    }
   
  } catch (e) {
    print(e);
  }
};

export default nordkirchen;
