import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const leverkusan = async function (cluster, page, positions, levels) {
  try {
  
    page.setDefaultNavigationTimeout(0);
    let allJobs = [];
    let url =
      "https://www.klinikum-lev.de/stellenangebote.aspx?jobag=KL&jobagg=%C3%84rztlicher%20Dienst%20(Medizin)";

    await scroll(page);
    await page.goto(url,{timeout:0,waituntil:'load'});
       let links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".striped a")).map(
          (el) => el.href
        );
      });
    // getting all the data from links
    let allJobDetails = [];
    for (const link of links) {
      cluster.queue(async({page})=>{
      await page.goto(link, { timeout: 0 ,waituntil:'load'});
      scroll(page);
      await page.waitForSelector(
        "body > center > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td h1"
      );

      //get job titles
      const title = await page.evaluate(() => {
        return (
          document.querySelector(
            "body > center > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td h1"
          ).innerText || null
        );
      });
      // console.log(jobTitles);

      //get location
      const location = await page.evaluate(() => {
        let regex =
          /[a-zA-Z]+. [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+[\n][a-zA-Z]+.\s\d+[\n]\d+\s[a-zA-Z]+/;
        let text = document.querySelector("body");
        return text ? text.innerText.match(regex) : null;
      });
      
  
      let job = {
        title,
        location,
        hospital: '',
        position: '',
        level: '',
        email: '',
        link: link,
        republic: '',
      };
        
        
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
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (err) {
    print(err);
  }
};

export default leverkusan;