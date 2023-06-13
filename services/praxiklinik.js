import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const praxiklinik = async (cluster,page,positions,levels) => {
 try{
  let url = "https://www.preventicum.de/karriere.html";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  //get all links
  let titles = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".newsbox > .ce_text.block > h1 ")
    ).map((el) => el.innerText);
  });
  titles = titles.map((el) => {
    return el.replace("GESUCHT:", "").trim();
  });
  //get all job details
  let allJobs = [];
  for (let title of titles) {
    cluster.queue(async ({ page }) => {
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
    job.title = title;
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
      return document.querySelector(".ce_text.block > h2").innerText;
    });
      job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+\(at|)\w+\.\w+/);
       });
      
    if (typeof job.email == 'object' && job.email != null) {
      job.email = job.email[0];
    }
      if (job.email == null) {
      job.email = "N/A";
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


export default praxiklinik;
