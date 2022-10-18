import multer from 'multer';
const multerConfig = {
    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({
      //specify destination
      destination: function(req, file, next){
        if(file.fieldname=='design')
        next(null, './uploads/design');
        else if(file.fieldname=='blue_print')
        next(null, './uploads/blue_print');
      },

      //specify the filename to be unique
      filename: function(req, file, next){
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        //set the file fieldname to a unique name containing the original name, current datetime and the extension.
        next(null, file.fieldname + '-' + Date.now() + '.'+ext);
      }
    }),

    // filter out and prevent non-image files.
    fileFilter: function(req, file, next){
          if(!file){
            next();
          }
          next(null, true);
    }
  };

  export default multerConfig;