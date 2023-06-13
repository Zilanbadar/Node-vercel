import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

let kath = async (cluster,page, positions, levels) => {
  try {
    
    await page.goto(
      "https://www.karriere-johannes.de/jobs.html?term=&bereich=&einrichtung=3",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.layout_teaser.block.first.even > h2 > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      cluster.queue(async ({ page }) => {
        let job = {
          title: "",
          location: "Kath",
          hospital: "Kath.St Paulus",
          link: "",
          level: "",
          position: "",
          rupublic: "North Rhine-Westphelia",
          city: "Kath",
          email: "",
        };

        await page.goto(jobLink, {
          waitUntil: "load",
          timeout: 0,
        });

        await page.waitForTimeout(1000);

        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("h1.title");
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
          let apply = document.querySelector("p.online-bewerben.link > a ");
          return apply ? apply.href : "";
        });
        job.link = link;
        job.email = await page.evaluate(() => {
          return document.body.innerText.match()
        })
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


export default kath;
