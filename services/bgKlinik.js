import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let ugos_de = async (cluster,page,positions,levels) => {
  try {
  
    let urls = [
      "https://www.bg-kliniken.de/universitaetsklinikum-bergmannsheil-bochum/karriere/offene-stellen/?origin=3&area=&type=&",
    ];

    let nextPage = true;
    let allJobLinks = [];
    let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
        await page.goto(urls[counter], {
          waitUntil: "load",
          timeout: 0,
        });
        //wait for a while
        await page.waitForTimeout(1000);
        await scroll(page);
        // await page.waitForSelector('ol.fce__listbutton > li > a')
        //get all jobLinks
        let jobLinks = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("ol > li > a")).map(
            (el) => el.href
          );
        });
        let bottomNextLink = await page.evaluate(() => {
          return document.querySelector(
            "#pagination_0 > button.pagination__next.button"
          );
        });
        if (bottomNextLink) {
          await page.click("#pagination_0 > button.pagination__next.button");
          nextPage = true;
        } else {
          nextPage = false;
        }
        allJobLinks.push(...jobLinks);
        counter++;
      });
    } while (counter < url.length);
    console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital:
            "Berufsgenossenschaftliches Universitätsklinikum Bergmannsheil",
          link: "",
          level: "",
          position: "",
          city: "Bochum",
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
          let ttitle = document.querySelector("h1.fce__headline");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
    
        job.location = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.]+/
            ) || "Bürkle de la Camp-Platz 1 44789 Bochum"
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
          ) ||  'bewerbung@bergmannsheil.de'
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }
        // job.email = email

        // get link
        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector(
              "a.button button--secondary.button--blue button--slidebg.button--blurred"
            );
            return applyLink ? applyLink.href : "";
          });
          job.link = link;
        } else {
          job.link = jobLink;
        }

         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};

export default ugos_de;
