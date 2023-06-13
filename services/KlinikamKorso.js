import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
   
    let linknew = "https://www.klinik-am-korso.de/aktuelles/stellenangebote/#_";
    await page.goto(linknew, {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    let allJobs = [];

    let job = {
      title: "",
      location: "",
      hospital: "Klinik am Korso",
      link: "",
      level: "",
      position: "",
      city: "Bad Oeynhausen",
      email: "",
      republic: "North Rhine-Westphalia",
    };

    await page.waitForTimeout(1000);

    let title = await page.evaluate(() => {
      let text = Array.from(document.querySelectorAll(".panel-body > p"));
      return text[1].innerText;
    });
    job.title = title;

    job.location = await page.evaluate(() => {
      return (
        document.body.innerText.match(
          /[a-zA-Z-.ü]+ \d+\w+ [\n]\d+ [a-zA-Z-.ü]+|[a-zA-Z-.ü].+[\n]\d+ [a-zA-Z-.ü]+ [a-zA-Z-.ü]+|[a-zA-Z-.ü].+[\n]\d+ [a-zA-Z-.ü]+/
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

    if (!position in positions) {
      console.log("na");
    }

    //get link\

    job.email = await page.evaluate(() => {
      return (
        document.body.innerText.match(
          /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
        ) || ""
      );
    });
    if (typeof job.email == "object" && job.email != null) {
      job.email = job.email[0];
    }
    // job.email = email

    // get link
    let link1 = 0;
    if (link1) {
      const link = await page.evaluate(() => {
        let applyLink = document.querySelector("a.mail");
        return applyLink ? applyLink.href : "";
      });
      job.link = link;
    } else {
      job.link = linknew;
    }

    allJobs.push(job);
    // }
    print(allJobs);
    await save(allJobs.filter((job) => job.position != ""));
  } catch (e) {
    print(e);
  }
};


export default gfo_kliniken;
