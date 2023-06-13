import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";


    let Ekode = async (cluster,page, positions,levels) => {
      try {
      
        await page.goto("https://eko.de/unternehmen/stellenangebote.html", {
          waitForTimeout: 0,
          waitUntil : 'load'
        })
  
        await page.click("#c53853 > div > div.vbcn-placeholder.vbcn-placeholder-jobs.js-vbcn-placeholder > div > div > div > button")
  
        await page.waitForTimeout(4000);
        await scroll(page)
  
        // get all job links
        const jobLinks = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll('.onapply-job-ad__view-button')
          ).map((el) => el.href);
        });
        console.log(jobLinks);
  
  
        for (let jobLink of jobLinks) {
         cluster.queue(async ({ page }) => {
            let job = {
              title: "",
              location: "",
              hospital: "Evangelisches Krankenhaus Oberhausen",
              link: "",
              level: "",
              position: "",
              city: "Oberhausen",
              email: "",
              republic: "	North Rhine-Westphalia",
            };
  
            await page.goto(jobLink, {
              waitUntil: "load",
              timeout: 0,
            });
  
            await page.waitForTimeout(1000);
  
            let title = await page.evaluate(() => {
              let ttitle = document.querySelector(".job-ad-header__title");
              return ttitle ? ttitle.innerText : "";
            });
            job.title = title;
  
  
            job.location = await page.evaluate(() => {
              let text = document.querySelector("body");
              return text ? text.innerText.match(
                /[a-zA-Z]+. \d+ [|] \d+ [a-zA-Z,]+ [a-zA-Z]+|[a-zA-Z]+. \d+ [|] \d+ [a-zA-Z.]+|[a-zA-Z.]+ .[a-zA-Z.]+. [a-zA-Z.]+ .[a-zA-Z.]+. [a-zA-Z.]+/
              )
                : null;
            });
  
            if (typeof job.location == "object" && job.location != null) {
              job.location = job.location[0];
            }
  
  
            let text = await page.evaluate(() => {
              return document.body.innerText;
            });
            //get level
            let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
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
              let text = document.body.innerText.match('/[a-zA-Z- ]+@[a-zA-Z- ]/')|| 'N/A';
              return text
            });
  
            if (typeof job.email == "object" && job.email != null) {
              job.email = job.email[0];
            }
  
            //   getting applylink
            let link = await page.evaluate(() => {
              let Link = document.querySelector('.job-ad-button.job-ad-button--apply');
              return Link ? Link.href : "";
            })
     
            job.link = link;
            if (positions.map(el => el.toLowerCase()).includes(job.position)) {
              await save(job);
            }
          });
        }
       
      } catch (e) {
        print(e);
      }
    };

export default Ekode;