import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let gfo_kliniken = async (cluster,page,positions,levels) => {
  try {
 
    let links = "https://jungbrunnenklinik.de/karriere/";
    await page.goto(links, {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    let allJobs = [];

    // for (let jobLink of jobLinks) {
    let job = {
      title: "",
      location: "",
      hospital: "Jungbrunnen-Klinik",
      link: "",
      level: "",
      position: "",
      city: "Bonn",
      email: "",
      republic: "North Rhine-Westphalia",
    };

    let title = await page.evaluate(() => {
      let ttitle = document.querySelector(
        "#post-22 > div > div > div > div.et_pb_section.et_pb_section_0.et_section_regular > div > div > div.et_pb_with_border.et_pb_module.et_pb_blurb.et_pb_blurb_1.et_pb_text_align_left.et_pb_blurb_position_top.et_pb_bg_layout_light > div > div.et_pb_blurb_container > h2 > span"
      );
      return ttitle ? ttitle.innerText : "";
    });
    job.title = title;

    job.location = await page.evaluate(() => {
      return (
        document.body.innerText.match(
          /[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/
        ) || ""
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

    if (!position in positions) {
      console.log("run");
    }

    //get link\

    job.email = await page.evaluate(() => {
      return (
        document.body.innerText.match(
          /[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
        ) || "gborsum@dbkg.de"
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
        let applyLink = document.querySelector(".css_button a");
        return applyLink ? applyLink.href : "";
      });
      job.link = link;
    } else {
      job.link = links;
    }

    allJobs.push(job);
    // }
    save(allJobs);
    await save(allJobs.filter((job) => job.position != ""));
  } catch (e) {
    print(e);
  }
};



export default gfo_kliniken;
