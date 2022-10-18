import db from "../../models/";
import {respondWithError, respondWithSuccess} from '../../common/helper';

const User = db.User;
const Role = db.Role;
const Category = db.Category;
const Designation = db.Designation;
const Engineer = db.Engineer;
const Project = db.Project;

exports.index = async(req,res)=>{
    var user = req.user;
    var data = JSON.stringify({
        "data": "dashboard"
        });
    res.status(200).send(data);

};

exports.categoryList = async(req,res)=>{
    try{
        var categories = await Category.find().exec();
        return respondWithSuccess(res, "fetching", "categories", categories)
    }
    catch(e){
        console.log(e)
    }
};

exports.designationList = async(req,res)=>{
    var designations = await Designation.find().exec();
    return respondWithSuccess(res, "fetching", "designations", designations)
};

exports.engineerList = async(req,res)=>{
    var engineers = await Engineer.find().populate("designation", "-__v").exec();
    return respondWithSuccess(res, "fetching", "engineers", engineers)
};

exports.projectList = async(req,res)=>{
    var searchStr;
    if(req.query.search)
    {
            var regex = new RegExp(req.query.search.value, "i")
            searchStr = { $or: [{'project_name':regex },{'description': regex},{'location': regex }] };
    }
    else
    {
         searchStr={};
    }

    var projects = await Project.find(searchStr)
    .populate("project_head", "-__v")
    .populate("category", "-__v").sort({start_date: -1})
    .exec();
    return respondWithSuccess(res, "fetching", "projects", projects)
};

exports.engineerSave = async(req,res)=>{

    const staffData = {
        engineer_name : req.body.engineer_name,
        phone_number : req.body.phone_number,
        email: req.body.email,
        designation: req.body.designation
    }
    var staff = await Engineer.findOne({email:req.body.email}).exec();
    if(staff)
    return respondWithError(res,{ errorCode:400, message: "Email aleady exists" });

    new Engineer(staffData).save((err,engineer) => {
        if (err) {
        // console.log("error", err)
        return respondWithError(res,{ errorCode:400, message: "Engineer not created" });
        }

        return respondWithSuccess(res, "creating", "Staff", JSON.stringify(engineer))
    });
};

exports.engineerUpdate = async(req,res)=>{
    var staffId = req.params.staffId;
    var staff = await Engineer.findOne({_id:staffId}).exec();
    if(staff)
    {
        staff.engineer_name=req.body.engineer_name;
        staff.phone_number=req.body.phone_number;
        staff.email=req.body.email;
        staff.designation=req.body.designation;
        await staff.save();

        return respondWithSuccess(res, "updating", "Staff", JSON.stringify(staff))
    }
    else{
        return respondWithError(res,{ errorCode:400, message: "Staff does not exists" });
    }
};


exports.engineerDestroy = async(req,res)=>{
    var staffId = req.params.staffId;
    var staff = await Engineer.findOneAndDelete({_id:staffId}).exec();
    if(staff){
        return respondWithSuccess(res, "deleting", "Staff")
    }
    else{
        return respondWithError(res,{ errorCode:400, message: "Staff does not exists" });
    }

};

exports.projectSave = async(req,res)=>{
    let design = req.files.find((item)=>item.fieldname=="design")
    let blue_print = req.files.find((item)=>item.fieldname=="blue_print")
    console.log(blue_print)
    const projectData = {
        project_name : req.body.project_name,
        project_head : req.body.project_head,
        category : req.body.category,
        location : req.body.location,
        start_date : req.body.start_date,
        due_date : req.body.due_date,
        blue_print : blue_print?"blue_print/"+blue_print.filename:"",
        design : design? "design/"+design.filename:"",
        status : req.body.status,
        description : req.body.description
        }

    new Project(projectData).save((err,project) => {
        if (err) {
        // console.log("error", err)
        return respondWithError(res,{ errorCode:400, message: "Project not created" });
        }

        return respondWithSuccess(res, "creating", "project", JSON.stringify(project))
    });
}

exports.getEngineer = async(req,res)=>{
    var staffId = req.params.staffId;
    var staff = await Engineer.findOne({_id:staffId})
    .exec();
    if(staff)
    return respondWithSuccess(res, "fetching", "staff", staff)
    else
    return respondWithError(res,{ errorCode:400, message: "Staff does not exists" });
};

exports.getProject = async(req,res)=>{
    var projectId = req.params.projectId;
    var project = await Project.findOne({_id:projectId})
    .populate("project_head", "-__v")
    .populate("category", "-__v")
    .exec();
    if(project)
    return respondWithSuccess(res, "fetching", "project", project)
    else
    return respondWithError(res,{ errorCode:400, message: "Project does not exists" });
};

exports.projectUpdate = async(req,res)=>{
    let design = req.files.find((item)=>item.fieldname=="design")
    let blue_print = req.files.find((item)=>item.fieldname=="blue_print")
    
    var projectId = req.params.projectId;
    var project = await Project.findOne({_id:projectId}).exec();

    if(project)
    {
        project.project_name=req.body.project_name;
        project.project_head=req.body.project_head;
        project.category=req.body.category;
        project.location=req.body.location;
        project.start_date=req.body.start_date;
        project.due_date=req.body.due_date;
        project.status=req.body.status;
        project.description=req.body.description;
        project.blue_print=(blue_print) ? blue_print.path : project.blue_print;
        project.design=(design) ? design.path : project.design;
        await project.save();

        return respondWithSuccess(res, "updating", "project", JSON.stringify(project))
    }
    else{
        return respondWithError(res,{ errorCode:400, message: "Project does not exists" });
    }
};

exports.projectDestroy = async(req,res)=>{
    var projectId = req.params.projectId;
    var project = await Project.findOneAndDelete({_id:projectId}).exec();
    if(project){
        return respondWithSuccess(res, "deleting", "project")
    }
    else{
        return respondWithError(res,{ errorCode:400, message: "Project does not exists" });
    }
  };
