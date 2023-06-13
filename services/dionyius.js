import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let dionyius = async (cluster,page,positions,levels) => {
  try {
  
    const Link = "https://www.dionysius-walsum.de/fachklinik-st-camillus/"; 
    await page.goto( Link, {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);


      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "",
          hospital: "Fachklinik St. Camillus",
          link: "",
          level: "",
          position: "",
          city: "Duisburg",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        
        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".et_pb_text_inner h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;

        job.location = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/);
        });
        if (typeof job.location == "object") {
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

        if (!position in positions) {
          console.log(position)
        }

        //get link
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/[a-zA-Z-. ]+@[a-zA-Z-. ]+|[a-zA-Z-. ]+[(]\w+[)][a-zA-Z-. ]+/);
        });
        if (typeof job.email == "object") {
          job.email = job.email[0];
        }

    
        job.link = Link;

        if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
     

  } catch (e) {
    print(e);
  }
};

export default dionyius;
