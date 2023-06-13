import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let mores = async (cluster,page, positions,levels) => {
  try {
    await page.goto(
      "https://www.stift-tilbeck.de/jobs-karriere/stellenangebote/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    let nextPage = true;
    let alljobLinks = []
    while (nextPage) {
      // cluster.queue(async ({ page }) => {
        //scroll the page
        await scroll(page);
        await page.waitForTimeout(1000);
        const jobLinks = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll("div.outputContainer > div > div > a")
          ).map((el) => el.href);
        });
        alljobLinks.push(...jobLinks)
        
        await page.waitForTimeout(1000);
        let bottomNextLink = await page.evaluate(() => {
          return document.querySelector(
            "#job-search-pagination > li:nth-child(6) > a"
            );
          });
          if (bottomNextLink) {
            await page.click(
              "#job-search-pagination > li:nth-child(6) > a"
              );
              nextPage = true;
            } else {
              nextPage = false;
            }
            // });
          } //end of while loop
          console.log(alljobLinks)

    // let allJobs = [];

    for (let jobLink of alljobLinks) {
      // cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "Havixbeck",
        hospital: "Stift Tilbeck",
        link: "",
        level: "",
        position: "",
        email: "",
        republic: " North Rhine-Westphalia",
        city: "Havixbeck",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".jobinfos > h1 ");
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

      let link = await page.evaluate(() => {
        let lnk = document.querySelector(".cta > a");
        return lnk ? lnk.href : "";
      });
      job.link = link;

      let email = await page.evaluate(async ({ page }) => {
        return document.body.innerText.match(
          /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/gi
        );
      });
      job.email = String() + email;

      //   if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
      //     await save(job);
      //   }
      // });
      print(job);
    }
  } catch (e) {
    print(e);
  }
};

export default mores;
