import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";
let weidenauer = async (cluster,page,positions,levels) => {
  try {

    await page.goto(
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/",
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/?tx_news_pi1%5B%40widget_0%5D%5BcurrentPage%5D=2&cHash=cc76a9aac54932571a8b33a7f7c39d7c",
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/?tx_news_pi1%5B%40widget_0%5D%5BcurrentPage%5D=3&cHash=940e1d4044f01c1a7bf0d3af9039b908",
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/?tx_news_pi1%5B%40widget_0%5D%5BcurrentPage%5D=4&cHash=818d07e9becba43e82851c71a6099ea5",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.header > h3 > a ")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{

       let job = {
        title: "",
        location: "Weidenauser",
        hospital: "kreisklinikum-siegen",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("div.header > h3");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
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

      let link = await page.evaluate(() => {
        let apply = document.querySelector(".mail");
        return apply ? apply.innerText : "";
      });
      job.link = link;
      if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
        await save(job);
      }
    });
    }
   
  } catch (e) {
    print(e);
  }
};


export default weidenauer;
