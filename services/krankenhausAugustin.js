import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const krankenhausder_Augustin = async (cluster,page,positions,levels) => {
  try {
    
    const jobLinks = [];
    let urls = [
      "https://www.severinskloesterchen-karriere.de/stellenangebote/",
    ];
    // all jobsLinks

    for (let url of urls) {
      cluster.queue(async ({ page }) => {
      await page.goto(url);
      scroll(page);
      let job = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("li.filter > a")).map(
          (el) => el.href
        );
      });
      jobLinks.push(...job);
      });
    }
    
    for (let jobLink of jobLinks) {
      cluster.queue(async({page})=>{
        let job = {
        title: "",
        location: "Köln",
        hospital: 'Krankenhaus der Augustinerinnen "Severinsklösterchen"',
        link: "",
        level: "",
        position: "",
        email: "",
        city: "Köln",
        republic: " Weimar",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("div.bewerbung-title > h1");
        return ttitle ? ttitle.innerText : null;
      });
      job.title = title;
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
    
      //get link
      let link = await page.evaluate(() => {
        let link = document.querySelector("a.button-jetzt-bewerben");
        return link ? link.href : null;
      });
      job.link = link;
      let email = await page.evaluate(() => {
        let mail1 = document.querySelector("a.mail");
        return mail1
          ? mail1.href.match(
              /[a-zA-Z0-9-._+/]+@[a-zA-Z0-9-._+/]+\.[a-zA-Z0-9-]+/g
            )
          : null;
      });
      job.email = email;
      if (typeof email == "object") {
        job.email = "" + email;
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


export default krankenhausder_Augustin;
