import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let ugos_de = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.karriere-evk-duesseldorf.de/", {
      waitUntil: "load",
      timeout: 0,
    });
    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
      //scroll the page
      await scroll(page);
      //get all jobLinks
      // await page.waitForSelector(".layout_teaser.block.last.even > h2 > a")

      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".layout_teaser.block.last.even > h2 a")
        ).map((el) => el.href);
      });
      allJobLinks.push(...jobLinks);
      await page.waitForTimeout(3000);
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector(
          "#article-1711 > div > div.mod_ng_bwm_liste.block > nav > ul > li.next > a"
        );
      });
      if (bottomNextLink) {
        await page.click(
          "#article-1711 > div > div.mod_ng_bwm_liste.block > nav > ul > li.next > a"
        );
        nextPage = true;
      } else {
        nextPage = false;
      }
    }
    console.log(allJobLinks);
    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Gräfliche Kliniken - Caspar Heinrich Klinik",
          link: "",
          level: "",
          position: "",
          city: "Bad Driburg",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.title");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[a-zA-Z-.ßöü ]+ \d+[\n][\n]\d+[a-zA-Z-.ßöü ]+|[a-zA-Z-.ßöü ]+ \d+[\n]\d+[a-zA-Z-. ßöü]+|[a-zA-Z-.ßöü]+ \d+ . \d+ [a-zA-Z-.ßöü]+/
            ) || ""
          );
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
        // job.email = email

        // get link
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector(".online-bewerben.link ax`");
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



export default ugos_de;
