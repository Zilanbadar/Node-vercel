import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let herten = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.proselis.de/karriere/stellenmarkt", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tx-rssdisplay a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          city: "herten",
          title: "",
          location: "Mühlenstr. 2745659",
          hospital: "Elisabeth Hospital herten",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          email: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1");
          return ttitle ? ttitle.innerText : null;
        });
        job.title = title;

        // get email
        job.email = await page.evaluate(() => {
          let mail = document.body.innerText.match(
            /[a-zA-Z-. ]+[(][\w]+[)]\w+.\w+|[a-zA-Z-. ]+@[a-zA-Z-. ]+/
          );
          return mail ? mail[0] : "N/A"
        });

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(
          /Facharzt|Chefarzt|Assistenzarzt/ | "Arzt" | "Oberarzt"
        );
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

        let link = await page.evaluate(() => {
          let app = document.querySelector(".div-apply a");
          return app ? app.href : null;
        });
        job.link = link;
   
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector(".tx-rssdisplay a");
            return applyLink ? applyLink.href : "";
          });
          job.link = link;
        } else {
          job.link = jobLink;
        }
        
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default herten;
