using System;
using System.Web;

namespace MISEventManagement.Modules.Uploads {


    public class UploadProcessor {
        public bool UploadFile(HttpPostedFileBase submittedFile, string fileName = null, string fileExtension = null, PictureType pictureType = PictureType.Default, int number = -1, bool isNumbering = false, bool isPrivate = false, string rootPath = "~/Uploads/Images/") {
            try {
                if (fileName == null) {
                    fileName = submittedFile.FileName;
                }
                string absFileLocation = FileLocation.GetLocation(fileName: fileName, fileExtension: fileExtension, isPrivate: isPrivate, rootPath: rootPath);
                submittedFile.SaveAs(absFileLocation);
                return true;
            } catch (Exception) {

                throw new Exception("File can't be uploaded.");
            }
        }

        public bool UploadImageFile(HttpPostedFileBase submittedFile, string fileName, string fileExtension = "jpg", PictureType pictureType = PictureType.Default, int number = -1, bool isNumbering = false, bool isPrivate = false, string rootPath = "~/Uploads/Images/") {
            try {
                if (fileName == null) {
                    fileName = submittedFile.FileName;
                }
                string absFileLocation = FileLocation.GetImageLocation(fileName: fileName, fileExtension: fileExtension, pictureType: pictureType, number: number, isNumbering: isNumbering, isPrivate: isPrivate, rootPath: rootPath);
                submittedFile.SaveAs(absFileLocation);
                return true;
            } catch (Exception) {

                throw new Exception("File can't be uploaded.");
            }
        }


    }
}