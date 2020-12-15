const path = require('path');
exports.saveImage = async function (req, entity) {
  if (
    req.files &&
    files.file.mimeType.startsWith('image') &&
    files.file.size < process.env.MAX_FILE_UPLOAD
  ) {
    const file = req.files.file;
    file.name = `image_${entity._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (!err) {
        entity.image = file.name;
        await entity.save();
      }
    });
  }
};
