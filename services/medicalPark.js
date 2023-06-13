import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

const medical_Park= async (cluster,page,positions,levels) =>{
    try {
      
       await page.goto(
           "https://karriere.medicalpark.de/de/Stellenangebote"
           )
        // page.setDefaultNavigationTimeout(0);

        const jobLinks = [ ];
        let allUrls = [
            "https://karriere.medicalpark.de/de/Stellenangebote?page=1#",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=2",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=3",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=4",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=5",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=6",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=7",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=8",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=9",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=10",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=11",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=12",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=13",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=14",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=15#"
             ]
            // get all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
            cluster.queue(async({})=>{
                await page.goto(allUrls[a])
                await scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('div.inner > a')
            ).map((el) => el.href);
        })
        jobLinks.push(...jobs)
    });
          
        }

        const medicalJobs = [ ];
        for (let details of jobLinks) {
            cluster.queue(async({ page }) => {
            await page.goto(details);
            let jobsDetails = [ ];
            scroll(page);
          let title = await page.evaluate( () =>{
              let jobTitle = document.querySelector('div.col-lg-9.col-md-8.col-sm-7.job-content > h2');
              return jobTitle ? jobTitle.innerText : null;
          })
          jobsDetails.title = title;
           let email = await page.evaluate( () =>{
               let mail = document.querySelector('div#site-wrapper');
               return mail ? mail.innerText.match(/[a-zA-z0-9_+-./]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+/g) : null
           })
           jobsDetails.email = email;
         
        let location = await page.evaluate( () =>{
            let loc = document.querySelector('div#site-wrapper');
            return loc ? loc.innerText.match(/[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.\n?.[A-Za-z0-9]+.[ A-Za-z0-9]+.[a-z]\n.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.?[a-z0-9]\n.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+./g) : null
        });
                
        jobsDetails.location = location;
        let applyLink = await page.evaluate( () =>{
            let link1 = document.querySelector('div.button-wrapper > a');
            let link2 = document.querySelector('div.col-md-12 > a');
            return link1?.href ||  link2?.href 
        })
        jobsDetails.applyLink = applyLink;

          await page.waitForTimeout(4000)
          if(positions.map(el => el.position).includes(job.position)){
            await save(job);
          }
    });
        }
    } catch (err) {
        print(err)
    }
}

export default medical_Park;
