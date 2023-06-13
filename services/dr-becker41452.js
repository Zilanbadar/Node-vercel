import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto(
      "https://dr-becker-karriere.de/jobs/?filter[client_id][]=2&%20filter[client_id][]=3&filter[client_id][]=4&filter[client_id][]=5&filter[client_id][]=6&filter[client_id][]=8&filter[client_id][]=9&filter[client_id][]=13&filter[client_id][]=14&filter[client_id][]=15&filter[client_id][]=16&filter[client_id][]=17",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".joboffer_title_text.joboffer_box a")
      ).map((el) => el.href);
    });

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "",
          hospital: "Dr. Becker Rhein-Sieg-Klinik",
          link: "",
          level: "",
          position: "",
          city: "Nümbrecht",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //   let tit = 0;
        //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(
            ".scheme-content.scheme-title > h1"
          );
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          let loc = [...document.querySelectorAll(".content_text")];
          loc = loc.map((el) => el.innerText);
          loc = loc[4].split("\n");
          let loc1 = loc[2];
          return loc1;
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
          return (
            document.body.innerText.match(
              /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
            ) || "gborsum@dbkg.de"
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
        // job.email = email

        // get link
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector(".css_button a");
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


export default gfo_kliniken;
