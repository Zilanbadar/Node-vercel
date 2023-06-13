import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const bgKliniken = async (cluster,page,positions,levels) => {
  try {
   
    page.setDefaultNavigationTimeout(0);
    // scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.bg-kliniken.de/universitaetsklinikum-bergmannsheil-bochum/karriere/offene-stellen/?origin=&area=&type=&",
    ];

    let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      // get all job links
      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("ol.fce__list > li.fce__item > a")
        ).map((el) => el.href);
      });
      allJobs.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
      });
    } while (counter < allLinks.length);
    console.log(allJobs);
 
    //get data from every job post
    for (let jb of allJobs) {
      cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "BG University Hospital Bergmannsheil Bochum",
        hospital: "BG Kliniken",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine Westphelia",
        city: "Bochum",
        email:""
      };
      await page.goto(jb);
      scroll(page);
      let title = await page.evaluate(() => {
        let title = document.querySelector(".fce__text > h1");
        return title ? title.innerText : null;
      });
      job.title = title;
      const applyLink = await page.evaluate(() => {
        let link = document.querySelector(".fce__innerwrap > p > a");
        return link ? link.href : null;
      });
      job.link = applyLink;

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
        
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+@\w+\.\w+/);
        });

      await page.waitForTimeout(3000);
      if(positions.map(el => el.position).includes(job.position)){
        await save(job);
      }
      });
    }
   
  } catch (err) {
    print(err);
  }
};

export default bgKliniken;
