using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using MISEventManagement.Models.POCO.IdentityCustomization;
using MISEventManagement.Modules.Extensions.Context;


namespace MISEventManagement.Models.Context {

    public class DevIdentityDbContext : DevDbContext {
        public DevIdentityDbContext()
            : base("name=DefaultConnection") {
            this.Configuration.LazyLoadingEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder) {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
        public DbSet<CoreSetting> CoreSettings { get; set; }

        public DbSet<ImageResizeSetting> ImageResizeSettings { get; set; }
    }

}