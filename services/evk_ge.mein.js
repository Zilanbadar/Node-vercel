import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let ugos_de = async (cluster,page, positions,levels) => {
  try {
  
    let url = ["https://control2.jobcluster.de/JobPortal.php?id=1022#page-2"];

    let nextPage = true;
    let allJobLinks = [];
    let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
        await page.goto(url[counter], {
          waitUntil: "load",
          timeout: 0,
        });
        //wait for a while
        await page.waitForTimeout(1000);

        await scroll(page);
        await page.waitForSelector("a.vacancy_title");
        //get all jobLinks
        let jobLinks = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("a.vacancy_title")).map(
            (el) => el.href
          );
        });
        let bottomNextLink = await page.evaluate(() => {
          return document.querySelector(
            "#light-pagination > ul > li:nth-child(5) > a"
          );
        });
        if (bottomNextLink) {
          await page.click("#light-pagination > ul > li:nth-child(5) > a");
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
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Evangelische Kliniken Gelsenkirchen GmbH",
          link: "",
          level: "",
          position: "",
          city: "Gelsenkirchen",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //   await page.click("button.btn.btn-default")
        //   let tit = 0;
        //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
        job.location = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[a-zA-Z-.ßöü ]+ \d+[\n][\n]\d+[a-zA-Z-.ßöü ]+|[a-zA-Z-.ßöü ]+ \d+[\n]\d+[a-zA-Z-. ßöü]+|[a-zA-Z-.ßöü]+ \d+ . \d+ [a-zA-Z-.ßöü]+/
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

        job.email = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
        // job.email = email

        //   get link
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector(
              "a.btnInfoBoxAction.jcdBtnApplication.btn.btn-jcd-green.btn-apply-now.btn-sm"
            );
            return applyLink ? applyLink.href : "";
          });
          job.link = link;
        } else {
          job.link = jobLink;
        }
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};



export default ugos_de;
