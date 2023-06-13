import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let mathias = async (cluster,page, positions,levels) => {
  try {
   
    await page.goto("https://www.mathias-karriere.de/stellenangebote", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "a.results-col-link.bg-light.position-relative.d-block"
        )
      ).map((el) => el.href);
    });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "48431 Rheine",
          hospital: "Mathias-stifung",
          city: "Rheine",
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
          let ttitle = document.querySelector(
            "div.frame-type-header.co_msjobs-single__header > h1"
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
            "#c181 > div > div > div.col-12.col-xl-6.co_msjobs-single__col__right.co_msjobs-single__col.px-xl-5 > div > div.col-xl-8 > div.co_msjobs-single__description__contact.mb-5 > div > div > div > div > div > div > div:nth-child(2) > p > a:nth-child(3)"
          );

          return eml ? eml.href.slice(9) : "N/A";
        });
        job.email = String() + email;
        //apply link
        let link = await page.evaluate(() => {
          let lnk = document.querySelector("a.mb-4.btn.btn-secondary.btn-arrow");
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

        if (positiions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
};

export default mathias;
