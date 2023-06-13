import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let badberleburg = async (cluster,page,positions,levels) => {
  try {
 
    await page.goto("https://karriere.johanneswerk.de/stellenboerse.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tdtitle a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          city: "badberleburg",
          title: "",
          location: "",
          hospital: "Klinik Wittgenstein",
          link: "",
          level: "",
          position: "",
          republic: " North Rhine-Westphalia",
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
        // get location
        job.location = await page.evaluate(() => {
          let loc = document.querySelector(".jf-detail-left").innerText;
          loc = loc.replace("\n", " ");
          return loc.replace(
            /[A-Za-z]+.[A-Za-z]+.[A-Za-z]+\n[A-Za-z]+.[A-Za-z]+\n[A-Za-z]+\n[A-Za-z]+.[A-Za-z]+.[A-Za-z]+..\d+\n\d+./,
            ""
          );
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
     

        // get link
        let link = await page.evaluate(() => {
          return document.querySelector("#checkOutButton").href;
        });
        job.link = link;
      

        // get email
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+@\w+\.\w+/g);
        });
   
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
            await save(job);
          }
      });
    }
  } catch (err) {
    print(err);
  }
};



export default badberleburg;
