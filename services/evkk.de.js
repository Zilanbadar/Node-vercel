import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let karrierKrapp = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://www.evkk.de/karriere/stellenausschreibungen/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("ul.csc-menu.csc-menu-1 > li a")
      ).map((el) => el.href);
    });

    let titles = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("ul.csc-menu.csc-menu-1 > li a")
      ).map((el) => el.innerText);
    });
    console.log(titles);

    console.log(jobLinks);
    let allJobs = [];
    let counter = 0;
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
      
        let job = {
          title: "",
          location: "",
          hospital: "Evangelisches Krankenhaus Kalk",
          link: "",
          level: "",
          position: "",
          city: "Köln",
          email: "",
          republic: "Federal Republic of Germany",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = titles[counter];
        counter++;

        job.location = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[a-zA-Z-.ö]+ \d+.\d+[\n]\d+ [a-zA-Z-.ö]+|[a-zA-Z-.ö].+ \d+[\n]\d+ [a-zA-Z-.ö]+/
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
     

        job.email = await page.evaluate(() => {
          return (
            document.body.innerText.match(
              /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
            ) || "info@krupp-krankenhaus.de"
          );
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = job.email[0];
        }

        job.link = jobLink;

        if (positions.map(el => el.toLowerCase()).includes(job.position)) {
          await save(job);
        }
      });
    }
    print(allJobs);
    await save(allJobs.filter((job) => positions.indexOf(job.position)) >=0);
  } catch (e) {
    print(e);
  }
};

export default karrierKrapp;
