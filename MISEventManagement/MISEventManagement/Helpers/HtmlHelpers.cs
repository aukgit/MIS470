﻿using DevMVCComponent.Enums;
using MISEventManagement.Models.Context;
using MISEventManagement.Models.POCO.IdentityCustomization;
using MISEventManagement.Modules.Cache;
using MISEventManagement.Modules.TimeZone;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Linq;
using MISEventManagement.Modules.DevUser;
using MISEventManagement.Modules.Menu;
using MISEventManagement.Modules.Mail;

namespace MISEventManagement.Helpers {

    public static class HtmlHelpers {
        public static int TruncateLength = AppConfig.TruncateLength;
        const string _selected = "selected='selected'";

        #region Drop Downs

        #region Country
        /// <summary>
        /// 
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="countries"></param>
        /// <param name="classes">use  spaces to describe the classes</param>
        /// <param name="otherAttributes"></param>
        /// <returns></returns>
        public static HtmlString DropDownCountry(this HtmlHelper helper, List<Country> countries, string classes = "", string otherAttributes = "", string contentAddedString = "") {
            string countryOptionsGenerate = "<select class='form-control selectpicker " + classes + " country-combo' data-live-search='true' name='CountryID' " + otherAttributes + " title='Country' data-style='btn-success flag-combo fc-af'>";
            var sb = new StringBuilder(countryOptionsGenerate, countries.Count * 7);
            foreach (var country in countries) {
                sb.Append(string.Format("<option class='flag-country-combo flag {0}' title='| {1}' value='{2}'>", country.Alpha2Code.ToLower(), country.DisplayCountryName, country.CountryID));
                sb.Append(contentAddedString);
                //sb.Append();
                sb.Append(country.DisplayCountryName);
                sb.Append("</option>").AppendLine();
            }
            sb.AppendLine("</select>");
            return new HtmlString(sb.ToString());
        }
        #endregion

        #region General DropDowns
        public static HtmlString DropDowns(this HtmlHelper helper, string valueField, string textField, string htmlName = null, string displayName = null, string modelValue = null, string isRequried = "*", string classes = null, string toolTipValue = null, string otherAttributes = "", string tableName = null, MISEventManagement.AppVar.ConnectionStringType connectionType = AppVar.ConnectionStringType.DefaultConnection) {
            string divElement = @"<div class='form-group {0}-main'>
                             <div class='controls'>
                                <label class='col-md-2 control-label' for='{0}'>{1}<span class='red '>{2}</span></label>
                                <div class='col-md-10 {0}-combo-div'>
                                    {3}
                                    <a href='#' data-toggle='tooltip' data-original-title='{4}' title='{4}' class='tooltip-show'><span class='glyphicon glyphicon-question-sign font-size-22 glyphicon-top-fix almost-white'></span></a>
                                </div>
                            </div>
                        </div>";
            // 0- name
            // 1- displayName
            // 2 - isRequried
            // 3 - select element
            // 4 - tooltipValue
            if (tableName == null) {
                tableName = valueField.Replace("ID", "");
            }
            if (modelValue == null) {
                modelValue = "";
            }
            if (classes == null) {
                classes = "btn btn-success";
            }
            if (displayName == null) {
                displayName = textField;
            }
            if (toolTipValue == null) {
                toolTipValue = "Please select " + displayName;
            }
            if (htmlName == null) {
                htmlName = valueField;
            }
            string selected = "";
            string countryOptionsGenerate = "<select class='form-control selectpicker " + classes + "' data-live-search='true' name='" + htmlName + "' " + otherAttributes + " title='Choose...' data-style='" + classes + "'>";
            var dt = CachedQueriedData.GetTable(tableName, connectionType, new string[] { valueField, textField });
            if (dt != null && dt.Rows.Count > 0) {
                var sb = new StringBuilder(countryOptionsGenerate, dt.Rows.Count + 10);
                DataRow row;
                for (int i = 0; i < dt.Rows.Count; i++) {
                    row = dt.Rows[i];
                    if (row[valueField].Equals(modelValue)) {
                        selected = _selected;
                    }
                    sb.Append(string.Format("<option value='{0}' {1} {2}>{2}</option>", row[valueField], selected, row[textField]));
                }
                sb.AppendLine("</select>");
                string complete = string.Format(divElement, htmlName, displayName, isRequried, sb.ToString(), toolTipValue);

                return new HtmlString(complete);
            } else {
                return new HtmlString("");
            }

        }
        #endregion

        #endregion

        #region Truncates
        public static string Truncate(this HtmlHelper helper, string input, int? length) {
            if (string.IsNullOrEmpty(input))
                return "";
            if (length == null) {
                length = TruncateLength;
            }
            if (input.Length <= length) {
                return input;
            } else {
                return input.Substring(0, (int)length) + "...";
            }
        }
        #endregion

        #region Link Generates

        public static HtmlString ContactFormActionLink(this HtmlHelper helper, string linkName, string title, string addClass = "") {
            string markup = string.Format(MailHtml.CONTACT_US_LINK, title, linkName, addClass, AppVar.Url);
            return new HtmlString(markup);
        }

        public static HtmlString SamePageLink(this HtmlHelper helper, string linkName, string title, bool h1 = true, string addClass = "") {
            //var area = HttpContext.Current.Request.RequestContext.RouteData.DataTokens["area"];
            //var controller = HttpContext.Current.Request.RequestContext.RouteData.Values["controller"];
            //var action = HttpContext.Current.Request.RequestContext.RouteData.Values["action"];

            string markup = "";


            //if (area != null) {
            //    markup = string.Format("<a href='/{0}/{1}/{2}' class='{3}' title='{4}'>{5}</a>", area, controller, action, addClass, title, linkName);
            //} else {
            //    markup = string.Format("<a href='/{0}/{1}' class='{2}' title='{3}'>{4}</a>", controller, action, addClass, title, linkName);
            //}
            string uri = System.Web.HttpContext.Current.Request.RawUrl.ToString();

            markup = string.Format("<a href='{0}' class='{1}' title='{2}'>{3}</a>", uri, addClass, title, linkName);
            if (h1) {
                markup = string.Format("<h1 title='{0}'>{1}</h1>", title, markup);
            }
            return new HtmlString(markup);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="linkName">null gives the number on the display</param>
        /// <param name="title"></param>
        /// <param name="number"></param>
        /// <param name="h1"></param>
        /// <param name="addClass"></param>
        /// <returns></returns>
        public static HtmlString PhoneNumberLink(this HtmlHelper helper, long phonenumber, string title, bool h1 = false, string addClass = "") {
            string phone = "+" + phonenumber;

            string markup = string.Format("<a href='tel:{0}' class='{1}' title='{2}'>{3}</a>", phone, addClass, title, phone);

            if (h1) {
                markup = string.Format("<h1 title='{0}'>{1}</h1>", title, markup);
            }
            return new HtmlString(markup);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="linkName">null gives the number on the display</param>
        /// <param name="title"></param>
        /// <param name="number"></param>
        /// <param name="h1"></param>
        /// <param name="addClass"></param>
        /// <returns></returns>
        public static HtmlString PhoneNumberLink(this HtmlHelper helper, string phonenumber, string title, bool h1 = false, string addClass = "") {
            string phone = "+" + phonenumber;

            string markup = string.Format("<a href='tel:{0}' class='{1}' title='{2}'>{3}</a>", phone, addClass, title, phone);

            if (h1) {
                markup = string.Format("<h1 title='{0}'>{1}</h1>", title, markup);
            }
            return new HtmlString(markup);
        }

        public static HtmlString EmailLink(this HtmlHelper helper, string email, string title, bool h1 = false, string addClass = "") {
            string markup = string.Format("<a href='mailto:{0}' class='{1}' title='{2}'>{3}</a>", email, addClass, title, email);

            if (h1) {
                markup = string.Format("<h1 title='{0}'><strong title='" + title + "'>{1}</strong></h1>", title, markup);
            }
            return new HtmlString(markup);
        }

        #endregion

        #region Icons generate : badge
        public static HtmlString GetBadge(this HtmlHelper helper, long number) {
            string markup = string.Format(@"<span class='badge'>{0}</span>", number);

            return new HtmlString(markup);
        }

        #endregion

        #region Generate Navigation

        public static HtmlString GetMenu(this HtmlHelper helper, string menuName, bool isDependOnUserLogState = false) {
            string cacheName = menuName + "-menu-";
            if (isDependOnUserLogState && UserManager.IsAuthenticated()) {
                cacheName += UserManager.GetCurrentUserName();
            }
            var cache = (string)AppConfig.Caches.Get(cacheName);

            if (cache != null && !string.IsNullOrWhiteSpace(cache)) {
                return new HtmlString(cache);
            }

            using (var menuGenerator = new GenerateMenu()) {
                var menuItems = menuGenerator.GetMenuItem(menuName);

                if (menuItems != null && menuItems.NavigationItems != null) {
                    var items = menuItems.NavigationItems.ToList();
                    string menuListItems = menuGenerator.GenerateRecursiveMenuItems(items);
                    // keeping cache
                    AppConfig.Caches.Set(cacheName, menuListItems);
                    return new HtmlString(menuListItems);
                }
            }
            return new HtmlString("");
        }
        #endregion

        #region Image Generates


        public static HtmlString Image(this HtmlHelper helper, string img, string alt) {
            string markup = string.Format("<img src='{0}' alt='{1}'/>", VirtualPathUtility.ToAbsolute(img), alt);
            return new HtmlString(markup);
            //return (markup);
        }

        public static HtmlString Image(this HtmlHelper helper, string folder, string img, string ext, string alt) {
            string markup = string.Format("<img src='{0}{1}.{2}' alt='{3}'/>", VirtualPathUtility.ToAbsolute(folder), img, ext, alt);
            //return  new HtmlString(markup);
            return new HtmlString(markup);
        }

        #endregion

        #region List, Item Generate / Route Generates
        public static HtmlString RouteListItemGenerate(this HtmlHelper helper, string area, string display, string controller, string currentController) {
            string addClass = " class='active' ";
            if (controller != currentController)
                addClass = "";
            string markup = string.Format("<li{0}><a href='{1}'>{2}</a></li>", addClass, "/" + area + "/" + controller, display);
            //return  new HtmlString(markup);
            return new HtmlString(markup);
        }
        #endregion

        #region Date and Time Display

        public static HtmlString DisplayTimeFormat(this HtmlHelper helper, TimeZoneInfo timeZone, DateTime? dt = null, DateTimeFormatType type = DateTimeFormatType.Date, string format = "") {
            //dt = DateTime.SpecifyKind(dt, DateTimeKind.Utc);
            if (dt == null || timeZone == null) {
                return new HtmlString("");
            }
            if (format == "") {
                switch (type) {
                    case DateTimeFormatType.Date:
                        format = "dd-MMM-yyyy";
                        break;
                    case DateTimeFormatType.DateTimeSimple:
                        format = "dd-MMM-yyyy hh:mm:ss tt";
                        break;
                    case DateTimeFormatType.DateTimeFull:
                        format = "MMMM dd, yyyy hh:mm:ss tt";
                        break;
                    case DateTimeFormatType.DateTimeShort:
                        format = "d-MMM-yy hh:mm:ss tt";
                        break;
                    case DateTimeFormatType.Time:
                        format = "hh:mm:ss tt";
                        break;
                    default:
                        break;
                }
            }
            return new HtmlString(Zone.GetTime(timeZone, dt, format));
        }

        /// <summary>
        /// Returns empty string is no logged user and
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="dt"></param>
        /// <param name="timeZoneRequried"></param>
        /// <returns></returns>
        public static HtmlString DisplayDateTime(this HtmlHelper helper, DateTime? dt, bool timeZoneRequried = true) {
            if (dt == null) {
                return new HtmlString("");
            }
            if (timeZoneRequried) {
                return new HtmlString(Zone.GetDateTime(dt));
            } else {
                return new HtmlString(Zone.GetDateTimeDefault(dt));
            }

        }
        public static HtmlString DisplayDate(this HtmlHelper helper, DateTime? dt = null) {
            if (dt == null) {
                return new HtmlString("");
            }
            return new HtmlString(Zone.GetDate(dt));
        }

        public static HtmlString DisplayTime(this HtmlHelper helper, TimeZoneInfo timeZone, DateTime? dt = null) {
            if (dt == null || timeZone == null) {
                return new HtmlString("");
            }
            return new HtmlString(Zone.GetTime(timeZone, dt));
        }

        public static HtmlString DisplayDateTime(this HtmlHelper helper, TimeZoneInfo timeZone, DateTime? dt = null) {
            if (dt == null || timeZone == null) {
                return new HtmlString("");
            }
            return new HtmlString(Zone.GetTime(timeZone, dt));
        }
        #endregion

        #region Confirming Buttons
        public static HtmlString SubmitButton(this HtmlHelper helper, string buttonName = "Save", string alertMessage = "Are you sure about this action?") {
            string sendbtn = String.Format(
             "<input type=\"submit\" value=\"{0}\" onClick=\"return confirm('{1}');\" />",
             buttonName, alertMessage);
            return new HtmlString(sendbtn);
        }
        #endregion

        #region jQueryMobile Options
        /// <summary>
        /// JqueryMobile BackButton
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="buttonName"></param>
        /// <param name="icon"></param>
        /// <returns></returns>
        public static HtmlString BackButton(this HtmlHelper helper, string buttonName = "Back", bool isMini = false, string icon = "arrow-l") {
            string mini = (isMini)
                              ? "data-mini='true'"
                              : "";
            string backbtn = "<a href='#' data-role='button' class = 'back-button' data-rel='back' data_icon='" + icon + "' " + mini + " >" + buttonName + "</a>";
            return new HtmlString(backbtn);
        }
        #endregion


    }
}