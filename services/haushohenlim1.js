import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let haushohenlim1 = async (cluster,page,positions,levels) => {
  try {
    await page.goto("https://haushohenlimburg.de/jobs", {
      waitUntil: "load",
      timeout: 0,
    });
    //scroll the page
    await scroll(page);

    let allJobs = [];

    let job = {
      title: "",
      location: "Hagen",
      hospital: "Haus Hohenlimburg",
      link: "",
      level: "",
      position: "",
      city: 'Hagen',
      email: "mail@haushohenlimburg.de",
      republic:'North Rhine-Westphalia',
    };

    //   await page.waitForTimeout(3000)
    //   await page.waitForSelector('h1')
    let title = await page.evaluate(() => {
      let ttitle = Array.from(document.querySelectorAll("h4"));
      return ttitle ? ttitle.map((el) => el.innerText) : "";
    });
    job.title = title;

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

    if (!position in positions) {
      console.log(ok);
    }

    //get link
    let link = await page.evaluate(() => {
      let applyLink = document.querySelector(
        ".siteorigin-widget-tinymce.textwidget"
      );
      return applyLink
        ? applyLink.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/)
        : "";
    });

    job.link = link;

    allJobs.push(job);

    print(allJobs);
    await save(allJobs.filter((job) => job.position != ""));
  } catch (e) {
    print(e);
  }
};


export default haushohenlim1;
