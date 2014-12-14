using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ASPDemo.Models {
    public class Person {
        public int ID { get; set; }
        public string   FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime Birthday { get; set; }

        

    }

    public class YourDatabaseContext : DbContext {

        public YourDatabaseContext():base("DefaultConnection") {

        }
        public DbSet<Person> People { get; set; }
    } 
}