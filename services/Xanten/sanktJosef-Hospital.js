import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";


const SanktJosefHospital_Xanten = async (cluster,page,positions,levels) => {
    try {
      
        await page.goto(
            "https://www.sankt-josef-hospital.de/karriere/stellenmarkt/stellenangebote/"
            );
        page.setDefaultNavigationTimeout(0);

        const jobLinks = [];
        let allUrls = [
            "https://www.sankt-josef-hospital.de/karriere/stellenmarkt/stellenangebote/"
            ];
        for (let a = 0; a < allUrls.length; a++) {
          cluster.queue(async({page}) =>{
            await page.goto(allUrls[a]);
            scroll(page);
            let jobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.vc_btn3-container.vc_btn3-inline > a')
                ).map((el) => el.href);
            });
            jobLinks.push(... jobs);
          });
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);

        let jobDetails = [];
        for (let jobs of jobLinks) {
          cluster.queue(async({page}) =>{

            let job =  {
                title: "",
                location: "Xanten",
                hospital: "Sankt Josef-Hospital Xanten",
                link: "",
                level: "",
                position: "",
                city:"Xanten",
                email:"",
                republic:"North Rhine Westphelia",
              
              };
            scroll(page);
            await page.goto(jobs);
            let title = await page.evaluate(() => {
                let jbTitle = document.querySelector('h1.post_title')
                return jbTitle ? 
                jbTitle.innerText : null;
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
                return document.body.innerText.match(/[A_Za-z0-9._+/-]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
              });
              if (typeof link == "object") {
                job.link = link[0];
              }
            if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
              await save(job);
            }
            });
        }
        
    } catch (err) {
        print(err);
    }
};


export default SanktJosefHospital_Xanten;