import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

const diakonischeStiftung_Wittekindshof = async (cluster,page, positions, levels) =>{
    try {
     
        page.setDefaultNavigationTimeout(0);
        const jobLinks = [ ];
        let allUrls = [
            "https://karriere-wittekindshof.de/"
           ]
            // get all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('div.joboffer_title_text.joboffer_box > a'))
            .map((el) => el.href);

        })
        jobLinks.push(...jobs)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);
     
    let allDetails = [ ];
      for (let details of jobLinks) {
        cluster.queue(async ({ page }) => {
          let job = {
            title: "",
            location: "Bad Oeynhausen",
            hospital: "Diakonische Stiftung Wittekindshof",
            link: "",
            level: "",
            position: "",
            republic: "North Rhine-Westphalia",
            city: "Bad Oeynhausen",
            email: "",      
          };
          scroll(page)
          await page.goto(details)
          let title = await page.evaluate(() => {
            let title = document.querySelector('div.scheme-content.scheme-title > h1')
            return title ? title.innerText : null
          })
          job.title = title;
  
          let applyLink = await page.evaluate(() => {
            let link = document.querySelector('div#btn_online_application > a')
            return link ? link.href : null;
          })
          job.link = applyLink
          if (typeof applyLink == "object" && email != null) {
            applyLink = applyLink[0];
          } else if (applyLink == null) {
            applyLink = " ";
          }
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
            return document.body.innerText.match(/[A_Za-z0-9-._+/]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g) || "N/A";
          });
          job.email = String() + email

           if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
        });
    }
    } catch (err) {
        print(err)
    }
}

export default diakonischeStiftung_Wittekindshof;