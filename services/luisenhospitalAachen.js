import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let luisenhospital_Aachen = async (cluster,page,positions,levels) => {
  try {
   
    await page.goto("https://stellen.luisenhospital.de/stellenangebote.html", {
      waitUntil: "load",
      timeout: 0,
    });
 page.setDefaultNavigationTimeout(0)
    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.joboffer_title_text.joboffer_box> a")
      ).map((el) => el.href);
    });
  await page.waitForTimeout(1000)
    console.log(jobLinks)

    for (let jobLink of jobLinks) {
      cluster.queue(async({page}) =>{
      
      let job = {
        title: "",
        location: "",
        hospital: "Luisenhospital Aachen",
        link: "",
        level: "",
        position: "",
        city : "Aachen",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      let title = await page.evaluate(() => {
        let jbtitle = document.querySelector('div.scheme-content.scheme-title > h1')
        return jbtitle ? jbtitle.innerText : null;
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector('#scheme_detail_data > ul:nth-child(1) > li:nth-child(2)')
      return loc  ? loc.innerText : "Aachen"
      });

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
        let mail =  document.body.innerText.match(/[a-zA-Z0-9_+/.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+/g);
        return mail ? mail : "info@luisenhospital.de"
      });
      if (typeof job.email == "object"){
        job.email = "" + job.email;
      };
    // apply Links 
  job.link = await page.evaluate( () => {
    let apply = document.querySelector('div#btn_online_application > a')
    return apply ? apply.href : null
  })
    await page.waitForTimeout(1000);
    if(positions.map(el => el.toLowerCase()).include(job.position)){
      await save(job);
    }
});
}
} catch (err) {
    print(err);
  }
};



export default luisenhospital_Aachen;