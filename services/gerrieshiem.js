import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


const gerrieshiem = async (cluster,page,positions,levels) => {
  try {
  let url =
    "https://www.sana.de/duesseldorf-gerresheim/karriere/stellenangebote/#c63039";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("#container_2315 > a")).map(
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
      cluster.queue(async () => {
        await page.goto(link, { timeout: 0, waitUntil: "load" });
        await page.waitForTimeout(5000);
        let job = {
          title: "",
          location: "Duisburg",
          hospital: "Sana Krankenhaus Gerreshiem",
          link: "",
          level: "",
          position: "",
          city: "Düsseldorf",
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
        job.location = await page.evaluate(() => {
          return document.querySelector(".jobmeta > li").innerText;
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
        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    } //end of for loop
   
  } else {
    return [];
  }
} catch (error) {
  print(error);
}
};


export default gerrieshiem;
