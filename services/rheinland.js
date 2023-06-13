import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const rheinland = async (cluster,page,positions,levels) => {
 try{
  let url = "https://karriere.rheinlandklinikum.de/jobs#arztlicher-bereich";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  //get links titles, locations, hospitals
  let [titles, locations, hospitals] = await page.evaluate(() => {
    let text = Array.from(document.querySelectorAll(".portfolio-desc"))
      .map((el) => el.innerText)
      .map((el) => el.split("\n"));
    let titles = text.map((el) => el[0]);
    let locations = text.map((el) => el[1]);
    let hospitals = text.map((el) => el[3]);
    return [titles, locations, hospitals];
  });


  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".portfolio-desc >  h3 > a")
    ).map((el) => el.href);
  });
  //slice the links
  //get all job details
  let allJobs = [];
  let counter = 0;
  for (let link of links) {
    cluster.queue(async({page}) => {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "",
      hospital: "",
      link: "",
      level: "",
      position: "",
      city: "Würselen",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = titles[counter];
    job.hospital = hospitals[counter];
    job.location = locations[counter];
    let text = await page.evaluate(() => {
      return document.body.innerText;
    });
    counter++;
    job.email = text.match(/\w+@\w+\.\w+/);
    if (typeof job.email === "object" && job.email != null) {
      job.email = job.email[0];
    }
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

    if(positions.map(el => el.position).includes(job.position)){
      await save(job);
    }
  });
  } //end of for loop
}catch(err){
  print(err);
}
};


export default rheinland;
