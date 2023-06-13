import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
  
    await page.goto("https://www.wicker.de/karriere/stellenmarkt/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".row.catalog__content > ul > li > span a")
      ).map((el) => el.href);
    });

    

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) => {
         let job = {
        title: "",
        location: "",
        hospital: "Klinik am Osterbach",
        link: "",
        level: "",
        position: "",
        city: "Bad Oeynhausen",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(
          "h1.h2.util-uppercase.util-theme-red"
        );
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        return (
          document.body.innerText.match(
            /[a-zA-Z-.ü]+ \d+\w+ [\n]\d+ [a-zA-Z-.ü]+|[a-zA-Z-.ü].+[\n]\d+ [a-zA-Z-.ü]+ [a-zA-Z-.ü]+|[a-zA-Z-.ü].+[\n]\d+ [a-zA-Z-.ü]+|[a-zA-Z-.ü].+[\n][\n]\d+ [a-zA-Z-.ü].+/
          ) || "Am Osterbach 2, 32545 Bad Oeynhausen, Germany"
        );
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

      //get link\

      job.email = await page.evaluate(() => {
        return (
          document.body.innerText.match(
            /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          ) || "karriere@wicker.de"
        );
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }
      // job.email = email

      // get link
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector(
            "p.online-bewerben.link > a    "
          );
          return applyLink ? applyLink.href : "";
        });
        job.link = link;
      } else {
        job.link = jobLink;
      }

       if(positions.map(le => le.toLowerCase()).includes(job.position)){
        await save(job);
      }
      });
     
    }
  
  } catch (err) {
    print(e);
  }
};



export default gfo_kliniken;
