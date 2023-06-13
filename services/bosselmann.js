import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const bosselmann = async (cluster,page,positions,levels) => {
try{
  let url =
    "https://www.bosselmann-siepe.de/praxisklinik-bonn/stellenanzeigen/";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".custom-list-item  > a")).map(
      (el) => el.href
    );
  });
  //get all job details
  let allJobs = [];
  for (let link of links) {
    cluster.queue(async ({ page }) => {
    
      await page.goto(link, { timeout: 0, waitUntil: "load" });
      await page.waitForTimeout(5000);
      let job = {
        title: "",
        location: "Bonn",
        hospital: "Plastische & Ästhetische",
        link: "",
        level: "",
        position: "",
        repuplic: "North Rhine-Westphalia",
        email: ""
      };

      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@.*\.\w/).toString();
      });
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level and positions
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

     
      job.link = await page.evaluate(() => {
        return document.querySelector(
          ".vc_general.vc_btn3.vc_btn3-size-lg.vc_btn3-shape-rounded.vc_btn3-style-custom.vc_btn3-icon-left"
        ).href;
      });
       if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
    });
  } //end of for loop
 
}catch(err){
  print(err);
}
};


export default bosselmann;
