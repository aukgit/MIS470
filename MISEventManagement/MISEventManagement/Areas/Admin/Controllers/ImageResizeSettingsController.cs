using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using MISEventManagement.Models.Context;
using MISEventManagement.Models.POCO.IdentityCustomization;
using MISEventManagement.Modules.Uploads;

namespace MISEventManagement.Areas.Admin.Controllers {
    public class ImageResizeSettingsController : Controller {
        private readonly DevIdentityDbContext db = new DevIdentityDbContext();

        public ActionResult Index() {
            var list = db.ImageResizeSettings.ToList();
            bool change = false;
            foreach (var picType in Enum.GetValues(typeof(PictureType))) {
                var pictureType = picType.ToString();
                if (!list.Any(n => n.Name.Equals(pictureType))) {
                    var newImageType = new ImageResizeSetting() {
                        Name = pictureType,
                        Height = 0,
                        Width = 0,
                        Extension = "jpg"

                    };
                    db.ImageResizeSettings.Add(newImageType);
                    change = true;
                    //list.Add(newImageType);
                }
            }
            if (change) {
                db.SaveChanges();
            }

            list = db.ImageResizeSettings.ToList();
            return View(list);
        }

        public ActionResult Create() {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(ImageResizeSetting imageResizeSetting) {
            if (ModelState.IsValid) {
                db.ImageResizeSettings.Add(imageResizeSetting);
                db.SaveChanges();
                return RedirectToAction("Create");
            }

            return View(imageResizeSetting);
        }

        public ActionResult Edit(System.Int32 id) {

            var imageResizeSetting = db.ImageResizeSettings.Find(id);
            if (imageResizeSetting == null) {
                return HttpNotFound();
            }
            return View(imageResizeSetting);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(ImageResizeSetting imageResizeSetting) {
            if (ModelState.IsValid) {
                db.Entry(imageResizeSetting).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(imageResizeSetting);
        }


        public ActionResult Delete(System.Int32 id) {

            var imageResizeSetting = db.ImageResizeSettings.Find(id);
            if (imageResizeSetting == null) {
                return HttpNotFound();
            }
            return View(imageResizeSetting);
        }


        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id) {
            var imageResizeSetting = db.ImageResizeSettings.Find(id);
            db.ImageResizeSettings.Remove(imageResizeSetting);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing) {
            if (disposing) {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
