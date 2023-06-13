import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const wessel = async (cluster,page,positions,levels) => {
  try {
  let url =
    "https://www.wessel-gruppe.de/offene-stellen/?company_name=Fachklinik+Spielwigge&job_types=vollzeit,teilzeit";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForSelector("ui > li > input");
  await page.click("ui > li > input");
  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".job_listings > li > a")).map(
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
      location: "",
      hospital: "reha-Klinik Panorama",
      link: "",
      level: "",
      position: "",
      city: "Lippstadt",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = await page.evaluate(() => {
      return document.querySelector(".uk-article-title").innerText;
    });
    job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@.*\.\w/).toString();
    });
    job.location = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("p"))
        .map((el) => el.innerText)
        .filter((el) => el.match(/.+@.+\.\w+/))
        .join(",")
        .split("\n")
        .slice(0, 3)
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
    if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
      await save(job);
    }
    });
  } //end of for loop
  }catch(err) {
    print(err);
  }
};



 export default wessel;

