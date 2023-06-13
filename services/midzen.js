import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const midzen = async (cluster,page,positions,levels) => {
  try {
    
    await page.goto(
      "https://www.kkrn.de/karriere/stellenangebote/?s=112%27%22%2F&tx_fmkarriere_karriere%5Bcontroller%5D=Frontend&cHash=6319ee4aee12148c22e8b56e0cb0b85c",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h2 a")).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async({ page }) => {
let job = {
        city: "Dorsten",
        title: "",
        location: "Hervester Strasse 57 45768 Marl",
        hospital: "KKRN Catholic Clinic Ruhr Area North GmbH",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine-Westphalia",
        email: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : null;
      });
      job.title = title;
      // get email
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(
          /[a-zA-Z-. ]+[(][\w]+[)]\w+.\w+|[a-zA-Z-. ]+@[a-zA-Z-. ]+/
        );
      });
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(
        /Facharzt|Chefarzt|Assistenzarzt/ | "Arzt" | "Oberarzt"
      );
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"
      ) {
        job.position = "artz";
      }
      if (position == "pflege" || (position == "Pflege" && !level in levels)) {
        job.position = "pflege";
        job.level = "Nicht angegeben";
      }
     
      // get link
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector("h2 a");
          return applyLink ? applyLink.href : "";
        });
        job.link = link;
      } else {
        job.link = jobLink;
      }
      // get link
      let link = await page.evaluate(() => {
        let app = document.querySelector(
          "#c11774 > div > div > div.foot.clear > div.contact.clear > div.text > a"
        );
        return app ? app.href : null;
      });
      job.link = link;
      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      })
      
    }
   
  } catch (e) {
    print(e);
  }
};


export default midzen;
