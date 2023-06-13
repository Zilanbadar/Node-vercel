import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

const lungenklinik_Hemer = async (cluster,page, positions, levels) =>{
    try {
     
       await page.goto(
           "https://www.lungenklinik-hemer.de/leistungen-angebote/stellenangebote-ausbildung/"
           );
        page.setDefaultNavigationTimeout(0);

        const jobLinks = [ ];
        let allUrls = [
            "https://www.lungenklinik-hemer.de/leistungen-angebote/stellenangebote-ausbildung/"
        ]
            // all jobsLinks 
      for (let a = 0; a < allUrls.length; a++) {
        cluster.queue(async ({ page }) => {
          await page.goto(allUrls[a])
          scroll(page);
          let job = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('p.multijobs-readmorelink > a'))
              .map((el) => el.href);
          })
          jobLinks.push(...job);
        });
        }
      
       let jobDetails = [ ];

      for (let links of jobLinks) {
        cluster.queue(async ({ page }) => {
          await page.goto(links);
          let job = {
            title: "",
            location: " Hemer",
            hospital: "Lungenklinik Hemer",
            link: "",
            level: "",
            position: "",
            republic: "North Rhine-Wesphelia",
            city: "Hemer",
            email: ""
          };
          scroll(page);

          let title = await page.evaluate(() => {
            let jobTitle = document.querySelector('div.et_pb_code_inner > h2');
            return jobTitle ? jobTitle.innerText : null
          })
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
          //get link
          let link = await page.evaluate(() => {
            return document.body.innerText.match(/[A_Za-z0-9-._+/]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
          });
          if (typeof link == "object") {
            job.link = { ...link }
          }
          job.email = await page.evaluate(() => {
            return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
          });
          if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
            await save(job);
          }
        });
       }
    } catch (err) {
        print(err);
    }
};


export default lungenklinik_Hemer;
