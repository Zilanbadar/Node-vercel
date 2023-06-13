import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let prohomine = async (cluster,page,positions,levels) => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto(
      "https://prohomine.de/der-verbund/presse-unternehmenskommunikation/vortraege-veranstaltungen/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
      cluster.queue(async () => {
        //scroll the page
        await scroll(page);

        await page.waitForTimeout(1000);
        //get all jobLinks
        let jobLinks = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll(
              "#c3328 > div > div > div.tabs-entry-content > p > a"
            )
          ).map((el) => el.href);
        });
        allJobLinks.push(...jobLinks);
        await page.waitForTimeout(1000);
        let bottomNextLink = await page.evaluate(() => {
          return document.querySelector(
            "#c3328 > div > div.pagination-centered > ul > li.last.next > a"
          );
        });
        if (bottomNextLink) {
          await page.click(
            "#c3328 > div > div.pagination-centered > ul > li.last.next > a"
          );
          nextPage = true;
        } else {
          nextPage = false;
        }
      });
    } //end of while loop

    console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async () => {
        let job = {
          title: "",
          location: "46483 Wesel",
          hospital: "Marien-Hospital Wesel",
          city: "Wesel",
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
          let ttitle = document.querySelector("h2");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get email
        let email = await page.evaluate(() => {
          let eml = document.querySelector("#c3328 > div > div > div > p:nth-child(10) > a");
          return eml ? eml.innerText : "N/A";
        });
        job.email = String() + email;
        //apply link
        let link = await page.evaluate(() => {
          let lnk = document.querySelector("a.button");
          return lnk ? link.href : "";
        });
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
     
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
};


export default prohomine;
