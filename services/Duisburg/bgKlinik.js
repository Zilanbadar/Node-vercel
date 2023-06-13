import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

const bgKliniken = async (cluster,page, positions,levels) => {
    
    try {
       
        page.setDefaultNavigationTimeout(0);
        // scroll the page
        let allJobs = [];
        let allLinks = [
            "https://www.bg-kliniken.de/universitaetsklinikum-bergmannsheil-bochum/karriere/offene-stellen/?origin=4&area=&type=&"
        ];


        let counter = 0;
      do {
        cluster.queue(async ({ page }) => {
          await page.goto(allLinks[counter], { timeout: 0 });
          scroll(page);
          // get all job links
          let jobs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("ol.fce__list > li.fce__item > a")
            ).map(el => el.href);
          });
          allJobs.push(...jobs);
          counter++;
          await page.waitForTimeout(3000);
        });
        } while (counter < allLinks.length);
        console.log(allJobs);
   
        let allJobDetails = [];
    //get data from every job post
      for (let i = 0; i < allJobs.length; i++) {
        cluster.queue(async ({ page }) => {
      let job = {
        title: "",
        location: "BG University Hospital Bergmannsheil Bochum",
        hospital: "BG Kliniken",
        link: "",
        level: "",
        position: "",
      };
      await page.goto(allJobs[i]);
      scroll(page);
      let title = await page.evaluate(() => {
        let title = document.querySelector('.fce__text > h1')
        return title ? title.innerText : null;
      });
      job.title = title;
      const applyLink = await page.evaluate( () => {
          let link = document.querySelector('.fce__innerwrap > p > a')
          return link ? link.href : null
      })
      job.link = applyLink
     
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
      let email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/i) || "N/A";
        
      })
      job.email = String() + email
           if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
          await save(job);
        }
        });
    }
}catch(err) {
        print(err)
}
};

export default bgKliniken;

