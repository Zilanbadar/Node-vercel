import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


let  Marienhospital_Bottrop = async (cluster,page,positions,levels) => {
  try {
   

    await page.goto("http://www.mhb-bottrop.de/wirueberuns/stellenangebote/Seiten/default.aspx", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    let jobLinks = []
    const links = await page.evaluate(() => {
     return  Array.from(
        document.querySelectorAll("#ctl00_PlaceHolderMain_ctl01_ctl01__ControlWrapper_RichHtmlField > div > div > div > span > span > div > div >  a")
      ).map((el) => el.href);
    });
    jobLinks.push(...links)
    let jblinks = await page.evaluate ( () => {
        return  Array.from(
            document.querySelectorAll("li.dfwp-item > div >a")
          ).map((el) => el.href);
    })
    jobLinks.push(...jblinks)
    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
      let job = {
        title: "",
        location: "Bottrop",
        hospital: "Marienhospital Bottrop",
        link: "",
        level: "",
        position: "",
        city: "Bottrop",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("div.ms-rteElement-Headcontent");
        return ttitle ? ttitle.innerText : null
      });
      job.title = await page.evaluate(() => {
        let ttitle = document.querySelector("#aspnetForm > div:nth-child(18) > div > div > ol > span > span:nth-child(8)");
        return ttitle ? ttitle.innerText : null
      });
  
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
      //get link
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+/);
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = "" + job.email ;
      }

      job.link = jobLink;

      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      });
    }
  } catch (err) {
    print(err);
  }
};


export default Marienhospital_Bottrop;