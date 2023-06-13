import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let lukuss = async (cluster, page, positions, levels) => {
  try {
    
    await page.goto("https://www.lukas-krankenhaus.de/de/unser-haus/index-stellenangebote.php", {
      waitUntil: "load",
      timeout: 0,
    });
    //scroll the page
    await scroll(page);

    await page.waitForTimeout(1000);
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          "#list_cad63f69 > ul > li > div > h3 > a"
        )
      ).map((el) => el.href);
    });
    console.log(jobLinks);



    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
      let job = {
        title: "",
        location: "32257 frets",
        hospital: "Lukas-Krankenhaus Bünde gGmbH",
        city: "32257 frets",
        link: "",
        level: "",
        email: "",
        position: "",
        republic: "North Rhine-Westphalia",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
      //get title
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h2");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get email
      let email = await page.evaluate(() => {
        let mail =  document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) 
        return mail ? mail[0] : "personalabteilung@lukas-krankenkaus.de";
      });
      job.email =  email;
      //apply link
      let link = await page.evaluate(() => {
        let lnk = document.querySelector("#checkOutButton");
        return lnk ? lnk.href : "";
      });
      job.link = jobLink;
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
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
      if(positions.map(el => el.toLowerCase()).include(job.position)) {
        await save(job);
      }
    });
    }
  } catch (e) {
    print(e);
  }
};

export default lukuss;
