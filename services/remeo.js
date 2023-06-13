import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const remeo = async (cluster,page,positions,levels) => {
try{
  let url = "https://www.remeo.de/beruf-karriere/";
  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(5000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".matchValue.title > a")).map(
      (el) => el.href
    );
  });
  console.log(links);
  //slice the links

  //get all job details
  let allJobs = [];
  for (let link of links) {
    cluster.queue(async({page}) => {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "",
      hospital: "REMEO® Center Dortmund",
      link: "",
      level: "",
      position: "",
      city: "Dortmund",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = await page.evaluate(() => {
      return document.querySelector("h1").innerText;
    });
    console.log(job.title);
    job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@.*\.\w/).toString();
    });
    job.location = await page.evaluate(() => {
      return document.querySelector(
        ".job-location.location.location-light-icon"
      ).innerText;
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
      return document.querySelector(".btn").href;
    });

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

export default remeo;
