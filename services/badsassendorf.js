import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let badsassendorf1 = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://www.klinik-lindenplatz.de/unsere-klinik/karriere/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".table-cell a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          city: "Bad sassendorf",
          title: "",
          location: "",
          hospital: "Klinik Lindenplatz",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphalia",
          email: ""
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".text > h1");
          return ttitle ? ttitle.innerText : null;
        });
        job.title = title;

        // get email
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+@\w+\.\w+/g);
        });

        // get location
        job.location = await page.evaluate(() => {
          let loc = document.querySelector(".bw_contact").innerText;
          loc = loc.replace("\n", " ");
          return loc.replace(/[A-Za-z]+.[A-Za-z]+.[A-Za-z]+.[A-Za-z]+.[A-Za-z]+\n[A-Za-z]+.[A-Za-z]+\n[A-Za-z]+.[A-Za-z]+.[A-Za-z]+\n[A-Za-z]+.\d+\n\d+.[A-Za-z]+.[A-Za-z]+/, "");
        });

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //get level
        let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/ | "Arzt" | "Oberarzt");
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
          return document.querySelector(".cta-button a").href;
        });
        job.link = link
  
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
            await save(job);
          }
      });
    }
   
  } catch (err) {
    print(err);
  }
};


export default badsassendorf1;




