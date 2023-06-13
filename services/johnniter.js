import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
let johanniter = async (cluster,page,positions,levels) => {
  try {
  

    let url = "https://www.johanniter.de/johanniter-kliniken/neurologisches-rehabilitationszentrum-godeshoehe/karriere/";
    await page.goto(url,{timeout:0,waitUntil:"load"});
    await scroll(page);
     const links = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".c-content-list__text > h3 a")
        ).map((el) => el.href);
     });
    

    for (let Joblink of links) {
      cluster.queue(async ({ page }) => {
        await page.goto(Joblink, {
        waitUntil: "load",
        timeout: 0,
      });

      let job = {
        title: "",
        location: "",
        hospital: "Evangelisches Krankenhaus Bethesda Mönchengladbach",
        link: "",
        level: "",
        position: "",
        city: "Mönchengladbach",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      
      await scroll(page);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".c-page-title > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });

      //get location 
      job.location = await page.evaluate(() => {
        return (
          document.body.innerText.match(
            /[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/
          ) || "Bonn Bad Godesberg"
        );
      });

      if (typeof job.location == "object" && job.location != null) {
        job.location = job.location[0];
      }

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
      //get email 
      job.email = await page.evaluate(() => {
        return (
          document.body.innerText.match(
            /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          ) || "Sandra.Teckentrup(at)bs.johanniter-kliniken.de"
        );
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }
   
      let link = await page.evaluate(() => {
        let applink = document.querySelector(
          "a.c-button.c-button--main.c-button--large"
        );
        return applink ? applink.href : null;
      });

      job.link = link;
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
       
      });
    }
   
  } catch (e) {
    print(e);
  }
};



export default johanniter;
