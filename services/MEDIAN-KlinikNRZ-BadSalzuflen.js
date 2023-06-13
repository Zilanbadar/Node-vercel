import save from "../utils/save.js";
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";


let MEDIAN_KlinikNRZ_BadSalzuflen = async (cluster,page,positions,levels) => {
  try {
    await page.goto("https://www.median-kliniken.de/de/karriere/stellenangebote-bewerbung/stellenangebote.html?filter%5Bcountr%5D=Bad%20Salzuflen", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let urls =  Array.from(
        document.querySelectorAll("div.cell_jobtitle > a")
      ).map((el) => el.href);
      return urls;
    });
    
    
    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "",
          hospital: "MEDIAN Klinik NRZ Bad Salzuflen",
          link: "",
          level: "",
          position: "",
          city: "Bad Salzuflen",
          email: "",
          republic: "North Rhine-Westphalia",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        job.title = await page.evaluate(() => {
          let jbTitle = document.querySelector("div.emp_nr_stelle");
          return jbTitle ? jbTitle.innerText : null
        });
      

        job.location = await page.evaluate(() => {
          let loc = document.querySelector("footer > div:nth-child(1) > div > div > div:nth-child(3) > p:nth-child(2)")
          return loc ? loc.innerText : null;
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
     
        //get link
        job.email = await page.evaluate(() => {
          return document.body.innerText.match(/([a-zA-Z0-9_+./-]+\(\w+\)[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)|([a-zA-Z0-9_+./-]+.@.[a-zA-Z0-9_+-./]+\.[a-zA-Z0-9_-]+)/) || "N/A"
        });
        if (typeof job.email == "object" && job.email != null) {
          job.email = "" + job.email;
        }

        job.link = await page.evaluate(() => {
          let apply = document.querySelector("div#btn_online_application > a")
          return apply ? apply.href : null;
        })
        await page.waitForTimeout(2000);
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
  } catch (err) {
    print(err);
  }
};




export default MEDIAN_KlinikNRZ_BadSalzuflen;