import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let diakonia = async (cluster,page,positions,levels) => {
  try {
   

    await page.goto(
      "https://www.diakonie-sw.de/jobs-karriere/stellenangebote/aerzte/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".jobs-list-item-descr.clearfix > h2 a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Diakonie Klinikum Bethesda",
          link: "",
          level: "",
          position: "",
          city: "Freudenberg",
          email: "",
          republic: "Czech Republic",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;


        job.location = await page.evaluate(() => {
          let loc = document.querySelector(".news-single-item");
          return loc
            ? loc.innerText.match(
              /[a-zaA-Z]+ [a-zaA-Z]+. [a-zaA-Zö]+. [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zaA-Z]+ [a-zaA-Z]+. [a-zaA-Zö]+. [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+ [a-zA-Z]+-[a-zA-Z]+, [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+. [a-zA-Z]+ [a-zA-Z]+.[a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [|] [a-zA-Z]+-[a-zA-Z]+ [a-zA-Z]+ [|] [a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+ [a-zA-Z]+ [|] [a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+.[a-zA-Z]+ [a-zA-Z]+ [|] [a-zA-Z]+.[a-zA-Z]+ \d+.[|] \d+ [a-zA-Z]+|[a-zA-Z]+.[a-zA-Z]+ \d+.[|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+.[a-zA-Z]+ [a-zA-Z]+ [|] [a-zA-Z]+.[a-zA-Z]+ \d+.[|] \d+ [a-zA-Z]+/
            )
            : "";
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
    
      
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(
            /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
    
        job.link = jobLink;
 

           if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};

export default diakonia;
