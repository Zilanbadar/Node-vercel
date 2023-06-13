import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let Kreisklinikum_Siegen = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all pagination links 
    await scroll(page);
 let paginationLinks = await page.evaluate ( () => {
     let urls = Array.from(
        document.querySelectorAll("ul.f3-widget-paginator > li > a")
      ).map((el) => el.href);
      return urls;
 })
 let jobLinks  = []
    for (const url of paginationLinks) {
      cluster.queue(async ({ page }) => {
   
        await page.goto(url, {
          waitUntil: "load",
          timeout: 0
        })

        let jobslink = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("div.header > h3 > a")
          ).map((el) => el.href);

        })
        jobLinks.push(...jobslink)
      });
 }
    

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "",
          hospital: "Kreisklinikum Siegen",
          link: "",
          level: "",
          position: "",
          city: "Siegen",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let ttitle = document.querySelector("div.header > h3");
          return ttitle ? ttitle.innerText : "";
        });

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("#c5071 > div > div > div.news-text-wrap").innerText;
          // loc = loc.replace("\n", " ");
          return loc ? loc.match(/Kr[a-zA-Z0-9.,-/_]+.[a-zA-Z0-9.,-/_]+.[a-zA-Z0-9.,-/_]+.[a-zA-Z0-9.,-/_]+.\n?.[a-zA-Z0-9.,-/_]+.[a-zA-Z0-9.,-/_]+.\n?.[a-zA-Z0-9.,-/_]+.[a-zA-Z0-9.,-/_]+.[a-zA-Z0-9.,-/_]+.\n.[a-zA-Z0-9.,-/_]+.[a-zA-Z0-9.,-/_]+.[a-zA-Z0-9.,-/_]+./g) : null
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


        //get link
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = jobLink;
        if (positions.map(el => el.toLowerCase()).include(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
  
};

export default Kreisklinikum_Siegen;