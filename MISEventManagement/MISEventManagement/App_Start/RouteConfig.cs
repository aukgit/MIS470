using System.Web.Mvc;
using System.Web.Routing;

namespace MISEventManagement {
    public class RouteConfig {
        public static void RegisterRoutes(RouteCollection routes) {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("elmah");

            #region Login, Register, Authentication Additional Routes
            routes.MapRoute(
                   name: "RegisterConfig",
                   url: "Register",
                   defaults: new { controller = "Account", action = "Register", id = UrlParameter.Optional },
                   namespaces: new string[] { "MISEventManagement.Controllers" }
               );
            routes.MapRoute(
                name: "SignInConfig",
                url: "SignIn",
                defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional },
                namespaces: new string[] { "MISEventManagement.Controllers" }
            );
            routes.MapRoute(
                name: "LoginConfig",
                url: "Login",
                defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional },
                namespaces: new string[] { "MISEventManagement.Controllers" }
            );

            routes.MapRoute(
                name: "SignOut",
                url: "SignOut",
                defaults: new { controller = "Account", action = "SignOut", id = UrlParameter.Optional },
                namespaces: new string[] { "MISEventManagement.Controllers" }
            );

            routes.MapRoute(
               name: "ExternalSigninConfig",
               url: "ExtSignin",
               defaults: new { controller = "Account", action = "ExternalLogin", id = UrlParameter.Optional },
               namespaces: new string[] { "MISEventManagement.Controllers" }
           );
            #endregion

            #region Default Route
            routes.MapRoute(
                   name: "Direct",
                   url: "{action}",
                   defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                   namespaces: new string[] { "MISEventManagement.Controllers" }
            );
            routes.MapRoute(
                   name: "Default",
                   url: "{controller}/{action}/{id}",
                   defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                   namespaces: new string[] { "MISEventManagement.Controllers" }
            );
            #endregion


        }
    }
}
