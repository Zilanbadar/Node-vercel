import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

  const kkrnCatholic = async (cluster,page, positions,levels) => {
   try{
    page.setDefaultNavigationTimeout(0);
    let allJobs = [];
    let allLinks = [
      "https://www.kkrn.de/karriere/stellenangebote/?tx_fmkarriere_karriere%5Bcontroller%5D=Frontend&cHash=796a5ee3c9f4e29f77c466195b1bb05c"
    ];
    let counter = 0;
     do {
       cluster.queue(async ({ page }) => {
         await page.goto(allLinks[counter], {
           timeout: 0
         });
         scroll(page);
         // get all job links

         const jobs = await page.evaluate(() => {
           return Array.from(document.querySelectorAll(".title > h2 > a")).map(
             el => el.href
           );
         });

         allJobs.push(...jobs);
         counter++;
       });
      // await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    console.log(allJobs);

    const allJobsDetails = [];

     for (let details of allJobs) {
       cluster.queue(async ({ page }) => {
         let job = {
           title: "",
           location: "Hervester Strasse",
           hospital: "KKRN Catholic Clinic Ruhr Area North GmbH",
           link: "",
           level: "",
           position: "",
           republic: "North Rhine-Westphelia",
           city: "Ruhr",
           email: "",
         };
         await page.goto(details);
         scroll(page);
         await page.waitForSelector("h3");

         let title = await page.evaluate(() => {
           let title = document.querySelector(".stelle.clear > h1");
           return title ? title.innerText : null;
         });

         job["title"] = title;

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
           level == "Assistenzarzt"
         ) {
           job.position = "artz";
         }
         if (position == "pflege" || (position == "Pflege" && !level in levels)) {
           job.position = "pflege";
           job.level = "Nicht angegeben";
         }
         let applyLink = await page.evaluate(() => {
           let apply = document.querySelector('div.applynow > a')
           return apply ? apply.href : null;
         })
         job.link = applyLink;
         await page.waitForTimeout(3000)
         allJobsDetails.push(job);
         job.email = await page.evaluate(() => {
           return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
         });
         if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
           await save(job);
         }
       });
    }
  }catch(e){
    print(e)
  }
  };

export default kkrnCatholic;


