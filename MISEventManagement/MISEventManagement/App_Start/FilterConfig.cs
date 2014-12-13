using MISEventManagement.Filter;
using System.Web;
using System.Web.Mvc;

namespace MISEventManagement {
    public class FilterConfig {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new AreaAuthorizeAttribute());

        }
    }
}
