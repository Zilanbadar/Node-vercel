import scroll from  "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const Siegburg = async (cluster,page,positions,levels) => {
   try {
  
    page.setDefaultNavigationTimeout(0);
    //scroll the page
    let allJobs = [];
    let allLinks = [
        "https://www.helios-gesundheit.de/kliniken/siegburg/unser-haus/karriere/stellenangebote/?tx_heliosuwsjoboffers_joboffers%5Bclinic%5D=60&tx_heliosuwsjoboffers_joboffers%5Bareas%5D=&tx_heliosuwsjoboffers_joboffers%5Bsearch%5D=",
        "https://www.helios-gesundheit.de/kliniken/siegburg/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=2&cHash=ed114279e3b723f4be1c3351b0e60f88",
        "https://www.helios-gesundheit.de/kliniken/siegburg/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=3&cHash=29bd0c67216768947331d79ed8ce3b39",
        "https://www.helios-gesundheit.de/kliniken/siegburg/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=4&cHash=862cab72f3d37077f3d22a4d79e82bfe",
        ]
        ;
    let counter = 0;
    do {
     // cluster.queue(async({ page }) => {
      await page.goto(allLinks[counter], {
        timeout: 0,
      });
      scroll(page);
      //  get all job links
      let jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".tabular-list__link")).map(
          (el) => el.href
        );
      });
      console.log(jobs);
      allJobs.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    //});
    } while (counter < allLinks.length);
    let allJobDetails = [];
    // get data from every job post
     for (const url of allJobs) {
       const job = {
         title:"",
        location:"Siegburg",
        link:"",
        position:"",
        level:"",
        republic: "North Rhine-Westphalia",
        city: "Siegburg",
        email:"",
      };
      //cluster.queue(async({ page }) => {
      await page.goto(url);
      scroll(page);

      await page.waitForSelector(".billboard-panel__body > h2");
      job.title = await page.evaluate(() => {
        let text = document.querySelector(".billboard-panel__body > h2");
        return text ? text.innerText : null;
      });

      //get contacts
      await page.waitForSelector(".content-block-list");
          // get email
      job.email = await page.evaluate(() => {
        let text = document
          .querySelector(".content-block-list__container")
          .getElementsByTagName("article")[4];
        return text
          ? text.innerText.match(/[a-z.]+[a-z]+.\[at].[a-z-]+[a-z.]+[a-z.]+|[a-z.]+\@[a-z-]+[a-z.]+[a-z]+/g)
          : null;
      });

        // get location
        await page.waitForSelector(".content-block-list");
        let location = await page.evaluate(() => {
          let text = document.querySelector(".content-block-list")
      .getElementsByTagName("article")[4];
         return text ? text.innerText.match(/[a-zA-Z.]+.\d{2}\,.\d{5}.[a-zA-Z,]+.[a-zA-Z.]+.|[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z,]+.[a-zA-Z.]+.\d{2}\,.\d{5}.[a-zA-Z.]+./g) : null;
        });

        //get apply link
        await page.waitForSelector(".dialog__content");
        let applyLink = await page.evaluate(() => {
          let text = document.querySelector(".dialog__content >a");
          return text ? text.href : null;
        });
      
       let text = await page.evaluate(() => {
        return document.body.innerText;
      });
       //get level 
       let level = text.match(
        /Facharzt|Chefarzt|Assistenzarzt/,
        "Arzt",
        "Oberarzt"
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
       if (typeof job.email === "object") {
         job.email = job.email[0];
        }
    //   if(positions.map(el => el.position).includes(job.position)){
    //     await save(job);
    //   }
    // });
       job.link = url;
      await page.waitForTimeout(4000);
    }
  
  } catch (err) {
    console.log(err);
  }
};

export default Siegburg;    