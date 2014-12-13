using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MISEventManagement.Startup))]
namespace MISEventManagement {
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
