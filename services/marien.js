import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const marien = async (cluster,page,positions,levels) => {
  try {

  let url =
    "https://www.sankt-marien-ratingen.de/sankt-marien/beruf-und-karriere/stellenangebote";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".bite-title > a")).map(
      (el) => {
        if (el) {
          return el.href;
        }
      }
    );
  });
  if (links.length > 0) {
    print(links);
    //slice the links
    //get all job details
    let allJobs = [];
    for (let link of links) {
      cluster.queue(async({page}) =>{
         await page.goto(link, { timeout: 0, waitUntil: "load" });
      await page.waitForTimeout(5000);
      let job = {
        title: "",
        location: "Duisburg",
        hospital: "Sankt Marien Krankenhaus",
        link: "",
        level: "",
        position: "",
        city: "Ratingen",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await scroll(page);
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/);
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }
      job.location = await page.evaluate(() => {
        return document
          .querySelector(".container")
          .innerText.split("\n")
          .join(",");
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
   
      job.link = link;
      if (typeof job.link == "object") {
        job.link = job.link[0];
      }
      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      })
    } //end of for loop
  
  }
}catch(e){
  print(e);
}
};

export default marien;
