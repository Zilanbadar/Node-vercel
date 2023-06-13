import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


const hachen = async (cluster,page,positions,levels) => {
  try {
  let url = "https://www.sauerlandklinik-hachen.de/karriere.html";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".wrapper > h2 > a")).map(
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
      cluster.queue(async ({ page }) => {
      await page.goto(link, { timeout: 0, waitUntil: "load" });
      await page.waitForTimeout(5000);
      let job = {
        title: "",
        location: "Sundern",
        hospital: "Sauerlandklinik Hachen ",
        link: "",
        level: "",
        position: "",
        city: "Sundern",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await scroll(page);
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      if (typeof job.email == "object") {
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
        if (positions.map(el => el.toLowerCase()).inlcudes(jobDetails.title.toLowerCase())) {
        allJobs.push(job);
      }
      });
    } //end of for loop
  } 
  } catch (error) {
    console.log(error);
  }
};



export default hachen;
