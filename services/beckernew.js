import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let beckernew = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto(
      "https://dr-becker-karriere.de/jobs/?filter[client_id][]=2&%20filter[client_id][]=3&filter[client_id][]=4&filter[client_id][]=5&filter[client_id][]=6&filter[client_id][]=8&filter[client_id][]=9&filter[client_id][]=13&filter[client_id][]=14&filter[client_id][]=15&filter[client_id][]=16&filter[client_id][]=17",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("#joboffers > div > div.joboffer_title_text.joboffer_box > a")
        ).map((el) => el.href);
      });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "36466 Dermbach",
        hospital: "Helios Rhein Klinik Duisburg",
        city: "Dermbach",
        link: "",
        level: "",
        email: "",
        position: "",
        republic: "North Rhine-Westphalia",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
      //get title
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get email
      let email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+\@\w+.\w+/) || "N/A";
      });
      job.email = String() + email;
      //apply link
      let link = await page.evaluate(() => {
        let lnk = document.querySelector(
          "#btn_online_application > a"
        );
        return lnk ? lnk.href : "N/A";
      });
      job.link = link;
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

      if (!position in positions) {
        continue;
      }

      allJobs.push(job);
    }
    console.log(allJobs);
    return allJobs.filter((job) => job.position != "");
  } catch (e) {
    console.log(e);
  }
};

async function scroll(page) {
  await page.evaluate(() => {
    const distance = 100;
    const delay = 100;
    const timer = setInterval(() => {
      document.scrollingElement.scrollBy(0, distance);
      if (
        document.scrollingElement.scrollTop + window.innerHeight >=
        document.scrollingElement.scrollHeight
      ) {
        clearInterval(timer);
      }
    }, delay);
  });
}
beckernew()
export default beckernew;