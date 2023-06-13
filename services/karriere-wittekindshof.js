import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";

let diakoine = async (cluster,page,positions,levels) => {
  try {
  await page.goto(
  "https://karriere-wittekindshof.de/",
  {
  waitUntil: "load",
  waitForTimeout: 0,
  }
  );
  // await page.waitForTimeout(1000);
  await scroll(page);
  // get all job links
  const jobLinks = await page.evaluate(() => {
  return Array.from(
  document.querySelectorAll("div.joboffer_title_text.joboffer_box > a")
  ).map((el) => el.href);
  });
  console.log(jobLinks);
  let allJobs = [];
  for (let jobLink of jobLinks) {
  // cluster.queue(async ({ page }) => {
  await page.goto(jobLink, 
  { 
  timeout: 0,
  waitUntil: "load" 
  }
  );
  let job = {
  title: "",
  location: "",
  hospital: "Fachklinik 360°",
  link: "",
  level: "",
  position: "",
  city: "Ratingen",
  email: "",
  republic: "North Rhine-Westphalia",
  };
  await page.waitForTimeout(1000);
  job.location = await page.evaluate(() => {
  let text = document.querySelector("ul.scheme-additional-data");
  return text ? text.innerText : null
  // ? text.innerText.match(/[a-zaA-Z-.]+ \d+ [-|-] \d+ [a-zaA-Z-. ]+/)
  // : null;
  });
  if (typeof job.location == "object" && job.location != null) {
  job.location = job.location[0];
  }
  let title = await page.evaluate(() => {
  let ttitle = document.querySelector(
  ".scheme-content.scheme-title > h1"
  );
  return ttitle ? ttitle.innerText : "";
  });
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
  
  job.email = await page.evaluate(() => {
  return document.body.innerText.match(/[a-zA-Z0-9_+-.,/]+@[a-zA-Z0-9_+-.,/]+\.[a-zA-Z0-9_]+/g) || "N/A";
  });
  if (typeof job.email == "object" && job.email != null) {
  job.email = job.email + " ";
  }
  let link = await page.evaluate(() => {
  let Link = document.querySelector(".css_button a");
  return Link ? Link.href : "";
  });
  job.link = link;
  // if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
  // await save(job);
  // }
  print(job)
  // });
  }
  } catch (err) {
  print(err);
  }
};



export default diakoine;
