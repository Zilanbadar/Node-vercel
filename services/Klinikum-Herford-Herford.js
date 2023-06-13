
import scroll from "../utils/scroll.js";
import print from "../utils/print.js";
import save from "../utils/save.js";
const klinikumHerford = (cluster, page, positions, levels) => {
  try {
  
    page.setDefaultNavigationTimeout(0);
    let allJobs = [];
    let allLinks = [
      'https://www.klinikum-herford.de/karriere/stellenangebote-fuer-aerzte?f[9256][p]=1',
      'https://www.klinikum-herford.de/karriere/stellenangebote-fuer-aerzte?f[9256][p]=2'
    ];

    let counter = 0;
    do {
      cluster.queue(async ({ page }) => {
        await page.goto(allLinks[counter], { timeout: 0 });
        scroll(page);
        // get all jobs links
        let jobs = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll('.element_group a')
          ).map((el) => el.href)
        });
        allJobs.push(...jobs)
        counter++;
        await page.waitForTimeout(3000);
      });
    } while (counter < allLinks.length);
    //   console.log(allJobs);

    //   getting all the data from links
    let allJobDetails = []
    for (const url of allJobs) {
      cluster.queue(async ({ page }) => {
        await page.goto(url);
        scroll(page);
        await page.waitForSelector('.headline-row h1');
        const title = await page.evaluate(() => {
          return document.querySelector('.headline-row h1').innerText || null
        })
        // console.log(jobTitles);

        //get location
        let location = await page.evaluate(() => {
          let regex = /[A-Za-z]+.?[A-Za-z]+\n[A-Za-z]+.[A-Za-z]+\n[A-Za-z]+.[A-Za-z]+\s\d+\n\d+\s[A-Za-z]+/
          let text = document.querySelector('#e9355')
          return text ? text.innerText.match(regex) : null;
        });

        // get all emails
        let email = await page.evaluate(() => {
          let emailRegex = /[[A-Za-z]+@[A-Za-z]+-?[A-Za-z]+.?[A-Za-z]+/
          let emails = document.querySelector('#e9355')
          return emails ? emails.innerText.match(emailRegex) : null;
        });
        // console.log(email);

        // get all online apply link
        let applyLink = await page.evaluate(() => {
          return document.querySelector('.col-md-4 a').href
        });
        // console.log(applyLink);

        let job = {
          title: jobTitles,
          location,
          email,
          applyLink,
          city: '',
          republic: '',
          level: '',
          position: '',
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
        if (positions.map(el => el.toLowerCase()).includes(job.position.toLowerCase())) {
          await save(job);
        }
      });
    }
      
  } catch (error) {
    print(error);
  }
}

export default klinikumHerford;