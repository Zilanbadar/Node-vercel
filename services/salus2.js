import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const salus2 = async (cluster,page,positions,levels) => {
try{
  let url =
    "https://www.salus-kliniken.de/aktuelles/karriere-und-beruf/list/huerth/";
  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);

  //get all links
  let pages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".pagination > li > a")).map(
      (el) => el.href
    );
  });
  let links = [];
  for (let pg of pages) {
    cluster.queue(async ({ page }) => {
    await page.goto(pg, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    await scroll(page);
    let jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".list-item-header > a")).map(
        (el) => el.href
      );
    });
    links.push(...jobLinks);
  });
  }
  
  //get all job details
  let allJobs = [];
  for (let link of links) {
    cluster.queue(async ({ page }) => {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "Hürth",
      hospital: "salus klinik Hürth",
      link: "",
      level: "",
      position: "",
      city: "Hürth",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = await page.evaluate(() => {
      return document.querySelector("h2.fgColorOverride").innerText;
    });
    job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@.*\.\w/).toString();
    });
    
      if (typeof job.email == 'object' && job.email != null) {
        job.email = job.email[0];
      }
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
  });
  } //end of for loop
}catch(err){
  print(err);
}
};



export default salus2;
