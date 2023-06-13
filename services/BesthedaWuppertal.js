import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let besthadWuppertal = async (cluster,page,positions,levels) => {
  try {

    await page.goto("https://agaplesion-wuppertal.softgarden.io/de/widgets/jobs#", {
      waitUntil: "load",
      timeout: 0,
    });

    
    const allJoblinks= []

    await scroll(page)

    await page.waitForSelector('.matchValue.title a')
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".matchValue.title a")
      ).map((el) => el.href);
    });
    allJoblinks.push(...jobLinks)
    console.log(jobLinks);
    await page.waitForTimeout(3000);

    let allJobs = [];

    for (let jobLink of allJoblinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "Agaplesion Bethesda Krankenhaus Wuppertal",
          link: "",
          level: "",
          position: "",
          city: "Wuppertal",
          email: "",
          republic: "Czech Republic",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        //   let tit = 0;
        //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.align-center");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
   

        job.location = await page.evaluate(() => {
          let loc = document.querySelector(".free-text");
          return loc ? loc.innerText.match(/[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/) : ""
        
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

        let link1 = 0;
        if (link1) {
          const link = await page.evaluate(() => {
            let applyLink = document.querySelector('a.btn')
            return applyLink ? applyLink.href : ""
          })
          job.link = link;
        } else {
          job.link = jobLink
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


export default besthadWuppertal;