import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const lymphklinik = async (cluster,page,positions,levels) => {
  try {
   
    let url = "https://www.lymphklinik.com/karriere.html";
    await page.goto(url, { timeout: 0, waitUntil: "load" });

    //scroll the page

    await scroll(page)
    //get all jobs
    let titles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tm-article > ul > li")).map(
        (el) => el.innerText
      );
    });

    for (let title of titles) {
      cluster.queue(async({page}) =>{
    let job = {
      title: "",
      location: "Bad Berleburg",
      hospital: "Ödemzentrum Bad Berleburg",
      link: "",
      level: "",
      position: "",
      city: "Bad Berleburg",
      email : "",
      republic: "North Rhine-Westphalia"
    };
    job.link = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@\w+\.\w+/);
    });
    if (typeof job.link == "object") {
      job.link = job.link[0];
    }

    //get email 
      //get link
      job.email = await page.evaluate(() => {
        let mail = document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/g);
        return mail || "N/A"
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }


    let text = await page.evaluate(() => {
      return document.body.innerText;
    });
    //get level
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

   
      job.title = title;
      if(positions.map(el => el.toLowerCase()).include(job.position)) {
        await save(job);
      }
    });
    }
  
  } catch (error) {
    print(error);
  }
};

export default lymphklinik;
