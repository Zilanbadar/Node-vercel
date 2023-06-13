
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let bethel = async (cluster,page,positions,levels) => {
  try {

    const allJoblinks = []
    const links = [
      "https://karriere.bethel.de/go/0000_Gesundheitsberufe/5101501/", 
      "https://karriere.bethel.de/go/0000_Gesundheitsberufe/5101501/100/?q=&sortColumn=referencedate&sortDirection=desc",
      "https://karriere.bethel.de/go/0000_Gesundheitsberufe/5101501/200/?q=&sortColumn=referencedate&sortDirection=desc",
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
            document.querySelectorAll(".jobTitle-link")
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
          hospital: "Herzlich willkommen auf der Karriereseite der",
          link: "",
          level: "",
          position: "",
          city: "Bethel",
          email: "",
          republic: "Federal Republic",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);
        
        await pa
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".col-xs-12.fontalign-left > h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
   
    

        job.location = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-,]+ [a-zA-Z,]+ \d+/) || "";
        
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
          return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) || "pr.information[at]bethel.de, presse[at]bethel.de";
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0]
        }
        
        if(0){
          job.applylink = await page.evaluate(()=>{
            return document.querySelector('.btn.btn-primary.btn-large.btn-lg.apply.dialogApplyBtn').href
          })
        }else{
          job.link = jobLink;
        }
       
   
         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
    }
  } catch (e) {
    print(e);
  }
}


export default bethel;
