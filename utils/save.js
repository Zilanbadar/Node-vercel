import Job from "../api/models/Job.model.js";
import print from "../utils/print.js";


const save = async(job)=>{
    try{
        let exists = await Job.findOne({title:job.title});
        if(!exists) {
          
         Job.create(job,(err,doc)=>{
             if(!err){
                 print(doc);
             }

            });
        }
    } catch(err) {
        print(err);
    }
}

export default save;