import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let MedicalPark_KlinikamPark = async (cluster,page,positions,levels) => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://karriere.medicalpark.de/de/Stellenangebote", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const paginations = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("div.inner-wrapper > a")
      ).map((el) => el.href);
      return urls;
    });
   let jobLinks = [];
    for (const urls of paginations) {
      cluster.queue(async ({ page }) => {
        await page.goto(urls)
        let links = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll("a.fullwidth-link")
          ).map((el) => el.href);
        })
        jobLinks.push(...links)
      });
   }

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Bad Sassendorf",
          hospital: "Medical Park - Klinik am Park",
          link: "",
          level: "",
          position: "",
          city: "Bad Sassendorf",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let jbTitle = document.querySelector("h2.hidden-xs");
          return jbTitle ? jbTitle.innerText : null
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
          return document.body.innerText.match(/([a-zA-Z0-9_+./-]+\(\w+\)[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)|([a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)/) || "N/A";
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = "" + job.email;
        }

        job.link = jobLink;
        await page.waitForTimeout(2000);
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
};




export default MedicalPark_KlinikamPark;
