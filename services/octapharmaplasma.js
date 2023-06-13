
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const octapharmaplasma = async (cluster,page,positions,levels) => {
  try {
 
    let url = "https://www.octapharmaplasma.de/jobs";
    let locations = [];
    //visit the site
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    await page.waitForTimeout(3000);
    //remove the dialogue box
    await page.waitForSelector("div.ccm__cheading__close");
    await page.click("div.ccm__cheading__close");
    await page.waitForTimeout(1000);
    //scroll the page
    await scroll(page);
    //get all locations
    locations = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".card-header > h3")).map(
        (el) => el.innerText
      );
    });
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.card-body > p > a"))
        .map((el) => el.href)
        .filter((el) => !el.includes("@"));
    });
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "Mönchengladbach",
        hospital: "Octapharma Plasmaspend",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine-Westphalia",
        city: "Mönchengladbach",
        email:"",
      };
      await page.goto(jobLink, { waitUntil: "load", timeout: 0 });
      await page.waitForTimeout(1000);

      //scroll the page
      await page.evaluate(() => {
        for (let i = 0; i < 100; i++) {
          if (
            document.scrollingElement.scrollTop + window.innerHeight >=
            document.scrollingElement.scrollHeight
          ) {
            break;
          }
          document.scrollingElement.scrollBy(0, 100);
          setTimeout(1000);
        }
      });

      //get title
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      job.link = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
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

      if(typeof job.email === "object"){
        job.email = job.email[0];
      }
        
      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      });
    }
  
  } catch (error) {
    print(error);
  }
};
export default octapharmaplasma;
