import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const salus = async (cluster,page,positions,levels) => {
  try{
  let url =
    "https://www.salus-kliniken.de/aktuelles/karriere-und-beruf/list/castrop-rauxel/";
  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);

  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".list-item-header > a")).map(
      (el) => el.href
    );
  });

  //get all job details
  let allJobs = [];
  for (let link of links) {
    cluster.queue(async({page}) => {
      await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "",
      hospital: "salus klinik Castrop Rauxel",
      link: "",
      level: "",
      position: "",
      city: "Castrop-Rauxel",
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
    job.location = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".news.news-single > p"))
        .map((el) => el.innerText)[1]
        .split("\n")
        .slice(0, 3)
        .join(" ");
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
  }catch(err){
    print(err);
  }
  
};

export default salus;
