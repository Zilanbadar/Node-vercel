import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";
let kkmg = async (cluster,page, positions, levels) => {
try {
   
  await page.goto("https://www.kkhm.de/karriere/stellenanzeigen/#c622", {
    waitUntil: "load",
    timeout: 0,
  });
  await scroll(page);
  //get all jobLinks
  let jobLinks = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        "#news-container-622 > article > header > h3 > a"
      )
    ).map((el) => el.href);
  });
  console.log(jobLinks);

  // let allJobs = [];

  for (let jobLink of jobLinks) {
    cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "Sundern (Sauerland)",
        hospital: "Neurologische Klinik Sorpe",
        link: "",
        level: "",
        position: "",
        email: "",
        republic: " North Rhine-Westphalia",
        city: "Sundern",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
      //get title
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(
          "#c1215 > div > div > article > header > h3"
        );
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get email
      let email = await page.evaluate(() => {
        let eml = document.querySelector(
          "#c1215 > div > div > article > div > div.news-text-wrap > p:nth-child(18) > a"
        );

        return eml ? eml.herf : "N/A";
      });
      job.email = String() + email;
      //apply link
      job.link = jobLink;
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

      if (positiions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
        await save(job);
      }
    });
    print(job)
  }
} catch (e) {
  print(e);
}
}
export default kkmg
