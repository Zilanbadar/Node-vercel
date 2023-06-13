import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const bewerbung = async (cluster,page,positions,levels) => {
  try{
  let url =
    "https://bewerbung.rheinmaasklinikum.de/angebote.aspx?bInstitution=1";
  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".btn.btn-blue"))
      .map((el) => el.href)
      .filter((href, index) => index % 2 == 1);
  });
  
  let allJobs = [];
    for (let link of links) {
      cluster.queue(async ({ page }) => {
        await page.goto(link, { timeout: 0, waitUntil: "load" });
        await page.waitForTimeout(5000);
        let job = {
          title: "",
          location: "Würselen",
          hospital: "Rhein-Maas Klinikum GmbH",
          link: "",
          level: "",
          position: "",
          city: "Würselen",
          email: "recruiting(at)rheinmaasklinikum.de",
          republic: "North Rhine-Westphalia",
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
        job.link = link;

        if (typeof job.link == "object") {
          job.link = job.link[0];
        }
         if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
      });
  } //end of for loop
}catch(err){
  print(err);
}
};


export default bewerbung;
