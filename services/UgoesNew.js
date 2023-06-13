import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let ugos_de = async (cluster,page,positions,levels) => {
  try {
   

    let url = ["https://www.ugos.de/karriere/caspar-heinrich-klinik"];

    let nextPage = true;
    let allJobLinks = [];
    let counter = 0;
    do {
      cluster.queue(async({ page }) => {
      await page.goto(url[counter], {
        waitUntil: "load",
        timeout: 0,
      });
      //wait for a while
      await page.waitForTimeout(1000);
      await scroll(page);
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".articletype-0.jobs > h3 a")
        ).map((el) => el.href);
      });
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector(
          "#news-container-18962 > div:nth-child(13) > ul > li.last.next > a"
        );
      });
      if (bottomNextLink) {
        await page.click(
          "#news-container-18962 > div:nth-child(13) > ul > li.last.next > a"
        );
        nextPage = true;
      } else {
        nextPage = false;
      }
      allJobLinks.push(...jobLinks);
      counter++;
    });
    } while (counter < url.length);
    console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue( async({ page }) => {
      let job = {
        title: "",
        location: "",
        hospital: "Gräfliche Kliniken - Caspar Heinrich Klinik",
        link: "",
        level: "",
        position: "",
        city: "Bad Driburg",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
      //   let tit = 0;
      //   if(tit){
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".article h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector("#c18736");
        return loc
          ? loc.innerText.match(
              /[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/
            )
          : "";
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
        return document.body.innerText.match(
          /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
        );
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }
      job.link = jobLink;
      if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
        await save(job);
      }
    });
    }
  } catch (e) {
    console.log(e);
  }
};


export default ugos_de;
