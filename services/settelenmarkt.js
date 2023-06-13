import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const settelenmarkt = async (cluster,page,positions,levels) => {
  try{
  let url =
    "https://jobs.drv-bund-karriere.de/stellenmarkt/?wpv-jobort=bad-salzuflen&wpv_aux_current_post_id=763&wpv_aux_parent_post_id=763&wpv_view_count=761";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a"))
      .map((el) => el.href)
      .slice(45, 49);
  });
  //slice the links

  //get all job details
  let allJobs = [];
  for (let link of links) {
    cluster.queue(async ({ page }) => {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "",
      hospital: "Rehabilitationsklinik Am Langenbach",
      link: "",
      level: "",
      position: "",
      city: "Bad Salzuflen",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = await page.evaluate(() => {
      return document.querySelector("h1").innerText;
    });
    job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@.*\.\w/).toString();
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
  // print(allJobs);
  // await save(allJobs.filter(job => job.position == "artz"));
}catch(err) {
  print(err);
}
};

export default settelenmarkt;
