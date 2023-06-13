import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let evk_koeln = async (cluster,page,positions,levels) => {
  try {
    let jobLinks = []
    let allLinks = [
              "https://jobcluster.jcd.de/JobPortal.php?id=1272#page-1",
              "https://jobcluster.jcd.de/JobPortal.php?id=1272#page-2",
              "https://jobcluster.jcd.de/JobPortal.php?id=1272#page-3",
              "https://jobcluster.jcd.de/JobPortal.php?id=1272#page-4"
    ]
    let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
        await page.goto(allLinks[counter], { timeout: 0 });
        await scroll(page)
        const links = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll('.vacancy_title')
          )
            .map(el => el.href)
        });
        // console.log(links)
        jobLinks.push(...links);
        counter++
      });
    } while (counter > allLinks.length);
            console.log(jobLinks)
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Köln",
          hospital: "Evangelisches Klinikum Köln Weyertal",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          city: "Köln",
          emial: "bewerbung@evk-koeln.de"
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await scroll(page)

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("strong.job-jobtitle");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

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
        let link = await page.evaluate(() => {
          let applink = document.querySelector('a.btnInfoBoxAction.jcdBtnApplication.btn.btn-jcd-green.btn-apply-now.btn-sm');
          return applink ? applink.href : null;
        });
        job.link = link
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default evk_koeln;
