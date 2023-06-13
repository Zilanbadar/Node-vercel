import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";


let wirsuchenmenschen = async (cluster,page,positions,levels) => {
  try {

    await page.goto(
      "https://wirsuchenmenschen.de/jobs/?jq=neuwerk&city=M%C3%B6nchengladbach#mode-grid",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
      cluster.queue(async({page}) =>{
      await scroll(page);

      await page.waitForTimeout(1000);
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("div.title.h4 > a")).map(
          (el) => el.href
        );
      });
      allJobLinks.push(...jobLinks);

      await page.waitForTimeout(1000);
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector("button.button.blue.js-job-list-more");
      });
      if (bottomNextLink) {
        await page.click("button.button.blue.js-job-list-more");
        nextPage = true;
      } else {
        nextPage = false;
      }
    });
    } //end of while loop

    console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {

        let job = {
          title: "",
          location: "Warstein",
          hospital: "krankenhaus-warstein",
          city: "Warstein ",
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
          let ttitle = document.querySelector("div.ce-bodytext > h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+\@\w+\-\w+.\w+/) || "N/A";
        });
        job.email = String() + email;
        //apply link
        let link = await page.evaluate(() => {
          let lnk = document.querySelector("a.button");
          return lnk ? lnk.href : "N/A";
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

        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
  };
  


export default wirsuchenmenschen;
