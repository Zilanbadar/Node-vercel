import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const procelis = async (cluster,page,positions,levels) => {
  try{
  let url = "https://www.proselis.de/karriere/stellenmarkt";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".tx-rssdisplay > a ")).map(
      (el) => el.href
    );
  });
  //slice the links
  links = links.slice(0, 10);
  //get all job details
  let allJobs = [];
  for (let link of links) {
    cluster.queue(async ({ page }) => {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "Recklinghausen",
      hospital: "Prosper-Hospital Reckling",
      link: "",
      level: "",
      position: "",
      city:"Recklinghausen",
      republic: "North Rhine-Westphalia",
      email:"",
    };
    await scroll(page);
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
      return document.querySelector(".div-apply > a").href;
    });
      
      job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@\w+\.\w+/g);
    })
    if( typeof job.email == 'object' && job.email != null){
      job.email = job.email[0];
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


export default procelis;
