import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let fachKlinikOstberge = async (cluster,page,positions,levels) => {
  try {
    
    let link = "https://fachklinik-ostberge.de/freie-stellen";
    await page.goto(link, {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    let allJobs = [];
    let job = {
      title: "",
      location: "",
      hospital: "Fachklinik Ostberge",
      link: "",
      level: "",
      position: "",
      city: "Dortmund",
      email: "",
      republic: "Federal Republic of Germany",
    };

    await page.waitForTimeout(1000);
    let title = await page.evaluate(() => {
      let ttitle = document.querySelector("#post-49 > div > ul > li > span");
      return ttitle ? ttitle.innerText : "";
    });
    job.title = title;

    job.location = await page.evaluate(() => {
      return (
        document.body.innerText.match(
          /[a-zA-Z-.ö].+ \d+[\n][\n]\d+ [a-zA-Z-.ö]+/
        ) || ""
      );
    });

    if (typeof job.location == "object" && job.location != null) {
      job.location = job.location[0];
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
    //   if (!position in positions) {
    //     continue;
    //   }
    //get email
    job.email = await page.evaluate(() => {
      return document.body.innerText.match(
        /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
      );
    });
    if (typeof job.email == "object" && job.email != null) {
      job.email = job.email[0];
    }

    job.link = link;
    allJobs.push(job);

    print(allJobs);
    await save(allJobs.filter((job) => positions.indexOf(job.position) >= 0));
  } catch (e) {
    print(e);
  }
};

export default fachKlinikOstberge;
