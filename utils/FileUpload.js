const path = require('path');
const fs = require('fs');
const moment = require('moment');
exports.saveImage = async function (req, entity) {
  if (
    req.files &&
    req.files.image.mimetype.startsWith('image') &&
    req.files.image.size < process.env.MAX_FILE_UPLOAD
  ) {
    const file = req.files.image;
    file.name = `${moment().valueOf()}image_${entity._id}${
      path.parse(file.name).ext
    }`;
    try {
      await saveFile(file, entity);
    } catch (error) {
      console.log(error);
    }
  }
};

const saveFile = (file, entity) =>
  new Promise((resolve, reject) => {
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (!err) {
        fs.unlink(
          path.join(__dirname, `../public/uploads/${entity.image}`),
          (err) => {}
        );
        entity.image = file.name;
        await entity.save();
        resolve();
      }
      reject();
    });
  });

exports.saveImages = async function (req, entity) {
  if (req.files) {
    let files;
    if (Array.isArray(req.files.image)) {
      files = req.files.image;
    } else {
      files = [req.files.image];
    }
    for (let image of files) {
      if (
        image.mimetype.startsWith('image') &&
        image.size < process.env.MAX_FILE_UPLOAD
      ) {
        let mainImage;
        if (image.name.startsWith('Main')) {
          mainImage = 'Main';
        } else {
          mainImage = 'Icon';
        }
        image.name = `${moment().valueOf()}${mainImage}image_${entity._id}${
          path.parse(image.name).ext
        }`;
        let oldFileName;
        if (mainImage == 'Main') {
          oldFileName = entity.image;
        } else {
          oldFileName = entity.icon;
        }
        await saveEventFiles(
          image,
          entity,
          path.join(__dirname, `../public/uploads/${oldFileName}`)
        );
      }
    }
  }
};

const saveEventFiles = (file, event, oldFileName = null) =>
  new Promise((resolve, reject) => {
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (!err) {
        console.log(`SAVE FILE ERROR = ${err}`);
        if (oldFileName) {
          fs.unlink(oldFileName, (err) => {
            console.log(`REMOVE OLD ERROR = ${err}`);
          });
        }
        if (file.name.includes('Main')) {
          event.image = file.name;
        } else {
          event.icon = file.name;
        }
        await event.save();
        resolve();
      }
      reject();
    });
  });
