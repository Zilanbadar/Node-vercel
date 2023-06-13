import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const marienHospital_bruhl = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto(
      "https://www.marienhospital-bruehl.info/service/karriere/stellenangebote.html"
    );
    page.setDefaultNavigationTimeout(0);

    const jobLinks = [];
    let urls = [
      "https://www.marienhospital-bruehl.info/service/karriere/stellenangebote.html",
    ];
    for (let url of urls) {
      cluster.queue(async ({ page }) => {
        await page.goto(url);
        scroll(page);
        let job = await page.evaluate(() => {
          return Array.from(document.querySelectorAll(".breakword > a")).map(
            (el) => el.href
          );
        });
        jobLinks.push(...job);
      });
     
    }
    
    for (let links of jobLinks) {
      cluster.queue(async ({ page }) => {
        await page.goto(links);
        await scroll(page);
        let job = {
          title: "",
          location: "Brühl",
          hospital: "Marienhospital Brühl",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine Westphelia",
          city: "Brühl",
          email: "",
        };
        // page.waitForSelector(".accordion-title")
        const title = await page.evaluate(() => {
          let jobTitle1 = document.querySelector("div.inner > h2");
          let jobTitle2 = document.querySelector("div.pageHeadline ");
          return jobTitle1?.innerText || jobTitle2?.innerText;
        });
        job.title = title;
        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //level
        let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
        let position = text.match(/arzt|pflege/);
        job.level = level ? level[0] : "";
        if (
          level == "Facharzt" ||
          level == "Chefarzt" ||
          level == "Assistenzarzt"
        ) {
          job.position = "artz";
        }
        if (position == "pflege" || (position == "Pflege" && !level in levels)) {
          job.position = "pflege";
          job.level = "Nicht angegeben";
        }

        let applyLink = await page.evaluate(() => {
          let link = document.querySelector("a.onlinebewerben.btn.btn--invert");
          return link ? link.href : null;
        });
        job.link = applyLink;
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+@\w+\.\w+/);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        } else if (job.email == null) {
          job.email = "N/A";
        }
        await page.waitForTimeout(4000);
        if (positions.map(el => el.position).includes(job.position)) {
          await save(job);
        }
      });
     
    }
   
  } catch (err) {
    print(err);
  }
};

export default marienHospital_bruhl;
