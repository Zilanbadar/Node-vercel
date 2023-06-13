import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";
let gummersbach = async (cluster,page, positions,levels) => {
  try {
    
    await page.goto(
        "https://www.klinikum-oberberg.de/karriereausbildung/stellenangebote",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
        let a = document.querySelector("#esDatentabelle_next > a");
        a.click()
      return Array.from(document.querySelectorAll("a.openItem.jsDatatableOeffneZeile")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Gummersbach",
          hospital: "klinikum-oberberg",
          link: "",
          level: "",
          position: "",
          republic: "North Rhine-Westphelia",
          city: "Gummersbach",
          email: "",

        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.obsInformation__stellenTitel");
          return ttitle ? ttitle.innerText : "";
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
          let apply = document.querySelector("#esLayout_main_inner > div.obsInformation.esVolleSeitenbreiteMitMargin > div.esDocumentview__PageWrapper.esDocumentview--rtf > div.obsInformation__innerWrapper > div > p:nth-child(28) > span > a")
          return apply ? apply.innerText : "";
        });
        job.link = link;
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/\w+\@\w+.\w+\-\w+.\w+/) || "N/A";
        });

        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
   
  } catch (e) {
    print(e);
  }
};


export default gummersbach;
