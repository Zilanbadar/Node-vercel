import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const florenceService = async (cluster,page, positions, levels) => {
  try {
   
    page.setDefaultNavigationTimeout(0);

    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%3Fref%3Dausbildungsatlas",
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%2527a%3D0chash%3D3b4262abd33953cbcab28989398ca953&tx_ttnews%5Bpointer%5D=1&cHash=5acac32e6cd26b46843fc7ce24f87062",
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%25252525252527A%2525253D0&tx_ttnews%5Bpointer%5D=2&cHash=e9db8017b61c163e555efe7db57bdcc4",
    ];
    let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
        await page.goto(allLinks[counter], { timeout: 0 });
        scroll(page);
        //get all job links

        let jobs = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll("div.news-list-item.clearfix > h2 > a")
          ).map((el) => el.href);
        });
        allJobs.push(...jobs);
        counter++;
        await page.waitForTimeout(3000);
      });
    } while (counter < allLinks.length);
    //console.log(allJobs);
    let allJobDetails = [];
    //get data from every job post
    for (let jobLink of allJobs) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Klinik für Psychiatrie und",
          link: "",
          level: "",
          position: "",
          city: "Düsseldorf",
          email: "",
          republic: "Rhine Westphalia",
        };

        await page.goto(jobLink, {
          timeout: 0,
          waitForTimeout: "load",
        });
        scroll(page);
        await page.waitForSelector("h2");
        //get job title
        let title = await page.evaluate(() => {
          let title = document.querySelector("h2");
          return title ? title.innerText : null;
        });
        job.title = title;

        //get job link
        let applyLink = await page.evaluate(() => {
          let link = document.querySelector("a.internal-link.button-blau");
          return link ? link.href : "";
        });
        if (typeof applyLink == "object" && cell != null) {
          applyLink = applyLink[0];
        } else if (applyLink == null) {
          applyLink = "";
        }
        job.link = applyLink;

        job.location = await page.evaluate(() => {
          let loc = document.body.innerText.match(/[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/)
            return loc ? loc[0] : ""
        });
        job.email = await page.evaluate(() => {
          let email = document.body.innerText.match(/\w+@\w+\.\w+/);
          return email ? email : document.body.innerText.match(/.+\(at\).+\.\w+/);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
        //get level and position
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
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};



export default florenceService;
