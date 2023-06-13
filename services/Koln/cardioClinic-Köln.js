import scroll from "../../utils/scroll.js";
import print from "../../utils/print.js";
import save from "../../utils/save.js";

const stJosefPaderborn = async (cluster,page, positions, levels) =>{
    try {
        
       await page.goto(
           "https://www.cardioclinic-koeln.de/cardioclinic-koeln/stellenausschreibungen"
           )
        page.setDefaultNavigationTimeout(0);
      let links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.csc-textpic-text > ul > li > a'))
          .map((el) => el.href);
      });

      for (let link of links) {
        cluster.queue(async ({ page }) => {
          let job = {
            title: "",
            location: "Sundern (Sauerland)",
            hospital: "Neurologische Klinik Sorpe",
            link: "",
            level: "",
            position: "",
            email: "",
            republic: "North Rhine-Westphalia",
            city: "Sundern"
          };
          scroll(page)
          await page.goto(link, { timeout: 0, waitUntil: "load" });
          await page.waitForTimeout(1000);
          let title = await page.evaluate(() => {
            let title = document.querySelector('.csc-textpic-text > p:nth-child(3)')
            return title ? title.innerText : null
          })
          job.title = title;
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
          let email = await page.evaluate(() => {
            return document.body.innerText.match(/[A_Za-z0-9._+/-]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
          });
          if (typeof link == "object") {
            job.email = email[0];
          }
          //get link
          job.link = joblink;
          if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
            await save(job);
          }
        });
    }
       
    } catch (err) {
        print(err);
    }
}


export default stJosefPaderborn;