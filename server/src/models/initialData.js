import bcrypt from 'bcryptjs';

// Initial Data Insert
const RoleData = ["Admin", "Executive"];
const CategoryData = ["House/Villa", "Appartments", "Hotels", "Restaurents", "Educational Institution", "INdustry/Factory", "Indoor Auditorium", "Commercial building"];
const DesignationData = ["Chief Engineer", "Trainee", "Manager", "Senior Executive"];
const EngineerData = [{engineer_name:"Max",email:"max@mailinator.com"}];

const InitialDataInsert = ({User, Role, Category, Engineer, Designation}) => {

    Role.estimatedDocumentCount((err, count) => {
        if(count===0 && !err)
        {
            console.log("Initial funciton of MongoDB");
            RoleData.map((role_item)=>{
                new Role({
                    name: role_item
                }).save((err,role) => {
                    if (err) {
                    console.log("error", err)
                    }
            
                    console.log(`added ${role_item} to roles collection`);
                    if(role_item == 'Admin')
                    User.estimatedDocumentCount((err, count) => {
                        if(count===0 && !err)
                        {
                            new User({ 
                                username: process.env.ADMINEMAIL,
                                first_name: "Admin",
                                email: process.env.ADMINEMAIL,
                                password : bcrypt.hashSync(process.env.ADMINPASSWORD, 8),
                                role : role._id,
                                status: 1
                            }).save().then(()=>{
                                console.log(`Admin User Created : niresh@mailinator.com/password`);
                            }).catch((e)=>{
                                console.log(`Admin User Not Created`);
                                console.log(e);
                            })
                        }
                    });
                });
            });
        }
    });

    Category.estimatedDocumentCount((err, count) => {
        if(count===0 && !err)
        CategoryData.map((item)=>{
            new Category({
                name: item
            }).save();
        });
    });

    Designation.estimatedDocumentCount((err, count) => {
        if(count===0 && !err)
        DesignationData.map((item)=>{
            new Designation({
                name: item
            }).save();
        });
    });

    Engineer.estimatedDocumentCount((err, count) => {
        if(count===0 && !err)
        EngineerData.map((item)=>{
            new Engineer({
                engineer_name: item.engineer_name,
                email:item.email
            }).save();
        });
    });    
}

module.exports = InitialDataInsert;
