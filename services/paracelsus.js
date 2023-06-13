import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const paracelsus = async (cluster,page,positions,levels) => {

  let url = "https://jobs.pkd.de/category/adorf-schoeneck/5559";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".module.moduleItems.hasShonts > a ")
    ).map((el) => el.href);
  });
  //get all job details
  let allJobs = [];
  for (let link of links) {
    cluster.queue(async({page}) => {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "Essen",
      hospital: "Preventicum - Privatärztli",
      link: "",
      level: "",
      position: "",
      republic: "North Rhine-Westphalia",
      city: "Essen",
      email:"",
    };
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

      job.link = link;
      
      job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@\w+\.\w+/);
    });
    if (typeof job.email == 'object' && job.email != null) {
      job.email = job.email[0];
    }
    if(positions.map(el => el.position).includes(job.position)){
      await save(job);
    }      
  });
  } //end of for loop
 
};


export default paracelsus;
