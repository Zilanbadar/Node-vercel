import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const annaClinic = async (cluster,page,positions,levels) => {
  try {

    page.setDefaultNavigationTimeout(0);

    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.helios-gesundheit.de/kliniken/duisburg-anna/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=1&cHash=3793ad35cf64220fb2082e71372afdbe",
      "https://www.helios-gesundheit.de/kliniken/duisburg-anna/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=2&cHash=45cde375fa8e0983511ddcd1fe020f01",
      "https://www.helios-gesundheit.de/kliniken/duisburg-anna/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=3&cHash=df93ad295a22ac9fc536b662f792c1a3",
    ];
    let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
      
        await page.goto(allLinks[counter]);
        scroll(page);
        //for all job links

        let jobs = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll("article.tabular-list__item > a")
          ).map((el) => el.href);
        });
        allJobs.push(...jobs);
        counter++;
      });
    } while (counter < allLinks.length);
  

    
    for (let allhrefs of allJobs) {
      cluster.queue(async ({ page }) => {
        await page.goto(allhrefs);
        scroll(page);
        let job = {
          title: "",
          location: "Duisburg",
          hospital: "Helios St. Anna Clinic Duisburg",
          link: "",
          level: "",
          position: "",
          email: "",
          republice: "North Rhine-Westphalia",
          city: "Duisburg",
        };
        //get title
        await page.waitForSelector("h2");
        let title = await page.evaluate(() => {
          let jbTitle = document.querySelector("div.billboard-panel__body > h2");
          return jbTitle ? jbTitle.innerText : null;
        });
        job["title"] = title;

        //  await page.click(".button-form")
        let applyLink = await page.evaluate(() => {
          let link = document.querySelector(".dialog__content > a ");
          return link ? link.href : null;
        });
        job.link = applyLink;

        let text = await page.evaluate(() => {
          return document.body.innerText;
        });
        //level
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
          return document.body.innerText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/i);
        });

        await page.waitForTimeout(3000);
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (error) {
    print(error);
  }
};


export default annaClinic;
