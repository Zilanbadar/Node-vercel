import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

async function label(jobs, token) {
  let decoded = jwt.decode(token);
  let userId = decoded._id;
  let user = await User.findById({ _id: userId });
  let savedJobs = user.savedJobs;
  return jobs.map((job) => {
    if (savedJobs.includes(job.id)) {
      return {
        _id: job._id,
        title: job.title,
        location: job.location,
        hospital: job.hospital,
        link: job.link,
        level: job.level,
        position: job.position,
        city: job.city,
        email: job.email,
        repulic: job.repulic,
        date: job.date,
        
        price: job.price,
        desc : job.desc,
        quantity : job.quantity,
        saved: true,
      };
    } else {
      return {
        _id: job._id,
        title: job.title,
        price: job.price,
        desc : job.desc,
        quantity : job.quantity,
        date: job.date,
        saved: false,
      };
    }
  });
}

export default label;
