import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const roeher = async (cluster,page,positions,levels) => {
  try{
  let url = "https://www.roeher-parkklinik.de/klinik/karriere/";
  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(5000);

  let titles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".fusion-toggle-heading")).map(
      (el) => el.innerText
    );
  });

  //get all job details
  let allJobs = [];
  for (let title of titles) {
    cluster.queue(async ({ page }) => {
    let job = {
      title: "",
      location:
        "ZAP – Center for Outpatient Psychotherapy,Röher Str. 55,52249 Eschweiler",
      hospital: "Röher Parkklinik",
      link: url,
      level: "",
      position: "",
      city: "Eschweiler",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = title;
 
    job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@.*\.\w/).toString();
    });

    let text = title;

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

    if(positions.map(el => el.position).includes(job.position)){
      await save(job);
    }
  });
  } //end of for loop
}catch(err) {
  print(err);
}
};

export default roeher;

