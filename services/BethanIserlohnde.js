import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let besthadIslerlohnde = async (cluster,page,positions,levels) => {
  try {

    const allJoblinks = []
    const links = ["https://www.bethanien-iserlohn.de/karriere/stellenangebote#sr",
    "https://www.bethanien-iserlohn.de/karriere/stellenangebote/page/2?cHash=8e588df8e7db8fcc40a9c85cf8b3e48c#sr"
]

    let counter = 0
    do {
      cluster.queue(async ({ page }) => {
        await page.goto(links[counter], {
          waitUntil: "load",
          timeout: 0,
        });

        await scroll(page);

        //get all jobLinks
        const jobLinks = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll(".col-xs-12 > h4 a")
          ).map((el) => el.href);
        });
        allJoblinks.push(...jobLinks)
        counter++
      });
    } while (counter < links.length);
    console.log(allJoblinks);
    let allJobs = [];

    for (let jobLink of allJoblinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Agaplesion Evangelisches Krankenhaus Bethanien Iserlohn",
          link: "",
          level: "",
          position: "",
          city: "Iserlohn",
          email: "",
          republic: "Federal Republic",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //   let tit = 0;
        //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".col-md-10.col-xs-12 h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
   
    

        job.location = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-.]+ \d+. \d+ [a-zA-Z-.]+|[a-zA-Z-.]+ \d+[\n]\d+ [a-zA-Z-.]+/) || "Bethanienallee 3 58644 Iserlohn";
        
        });

        if (typeof job.location == 'object' && job.location != null) {
          job.location = job.location[0]
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
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/);
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
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


export default besthadIslerlohnde;