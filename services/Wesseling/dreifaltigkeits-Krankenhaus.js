import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

const stellenausschreibungen = async (cluster,page,positions,levels) =>{
    try {
       
        page.setDefaultNavigationTimeout(0);
        const jobLinks = [ ];
        let allUrls = [
            "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=16"
           ]
            // get all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
          cluster.queue(async({page}) =>{
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return Array.from(document.querySelectorAll('.joboffer_title_text.joboffer_box > a')
            ).map((el) => el.href);
        })
        jobLinks.push(...jobs)
      });
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);
     
    let allDetails = [ ];
    for(let details of jobLinks) {
            cluster.queue(async({page}) =>{
            let job = {
            title: "",
            location: "Wesseling",
            hospital: "Dreifaltigkeits-Krankenhaus",
            link: "",
            level: "",
            position: "",
            city:"Wesseling",
            republic:"North Rhine westphelia"
          };
        scroll(page)
        await page.goto(details)
     let title = await page.evaluate ( () => {
        let title = document.querySelector('.scheme-content.scheme-title > h1')
        return title ? title.innerText : null
     })
     job.title = title;
  
     let applyLink = await page.evaluate( () =>{
         let link = document.querySelector('#btn_online_application > a')
         return link ? link.href : null;
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

      let email = await page.evaluate(()=>{
        return document.body.innerText.match(/\w+\\-w+\@\w+\\-\w+/)
      })
      job.email = email
     if(positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())){
       await save(job);
     }
            });
    }
    
    } catch (err) {
        print(err)
    }
}




export default stellenausschreibungen;