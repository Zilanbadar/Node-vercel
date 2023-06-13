import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let atalklinik = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.aatalklinik.de/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.shortcode-jobs > ul > li > a")
      ).map((el) => el.href);
    });

    //console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
      let job = {
        title: "",
        location: "",
        hospital: "Neurologische Klinik Sorpe",
        link: "",
        level: "",
        position: "",
        city: "Sundern",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1#page-title");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector(".sidebar-widget").innerText;
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

      //get link
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      if (typeof job.email == "object") {
        job.email = job.email[0];
      }

      job.link = jobLink;

      if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
        await save(job);
      }
    });
    }
   
  } catch (err) {
    print(err);
  }
};


export default atalklinik;
