import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";



let brul = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.marienhospital-bruehl.info/service/karriere/stellenangebote.html", {
      waitUntil: "load",
      timeout: 0,
    });
    //scroll the page
    await scroll(page);

    await page.waitForTimeout(1000);
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "div.job-item.shuffle-item.shuffle-item--visible > div > a"
        )
      ).map((el) => el.href);
    });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "50321 Brühl",
        hospital: "Marienhospital Brühl",
        city: "Brühl",
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
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get email
      let email = await page.evaluate(() => {
        return  document.body.innerText.match(/\w+.\w+\@\w+\-\w+.\w+/)  || "N/A";
      });
      job.email = String() + email;
      //apply link
      let link = await page.evaluate(() => {
        let lnk = document.querySelector("#tx_smsjobboerse_tabs_inhalt > div.inhaltbuttonrow > a.onlinebewerben.btn.btn--invert");
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
      if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
        await save(job);
      }
    });
  }
  } catch (e) {
    print(e);
  }
};

export default brul;
