import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto("https://www.atos-karriere.de/stellenanzeigen/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".av-masonry-container.isotope a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "",
        hospital: "ATOS Orthoparc Klinik Köln",
        link: "",
        level: "",
        position: "",
        city: "Köln",
        email: "",
        republic: "Federal Republic of Germany ",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
      //   let tit = 0;
      //   if(tit){
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".avia_textblock h2");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;
      job.location = await page.evaluate(() => {
        return (
          document.body.innerText.match(
            /[a-zA-Z-.]+ \d+. \d+ [a-zA-Z-.]+|[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.].+|[a-zA-Z-.].+ \d+ .[\n]\d+ [a-zA-Z-.].+|[a-zA-Z-.].+ \d+[-.]\d+[\n]\w+.\d+ [a-zA-Z-.]+|[a-zA-Z-.]+ \w+ \d+[\n]\n\d+ [a-zA-Z-.].+/
          ) || ""
        );
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
  
      //get link\

      job.email = await page.evaluate(() => {
        return document.body.innerText.match(
          /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+|[a-zA-Z-.]+[[]\w+.[a-zA-Z-.]+/
        );
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }
  
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector(
            "a.avia-button.av-kyu5ges3-e58692edc61fa09d1daa910d5916cea1.avia-icon_select-no.avia-size-large.avia-position-left.avia-color-green"
          );
          return applyLink ? applyLink.href : "";
        });
        job.link = link;
      } else {
        job.link = jobLink;
      }

        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
    
  } catch (e) {
    print(e);
  }
};


export default gfo_kliniken;
