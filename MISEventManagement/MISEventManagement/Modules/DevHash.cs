using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace MISEventManagement.Modules {
    public static class DevHash {
        /// <summary>
        /// Checks nulls and returns only codes for existing ones.
        /// </summary>
        /// <param name="o"></param>
        /// <returns></returns>
        public static string Get(params object[] o) {
            StringBuilder _sb = new StringBuilder(10);
            _sb.Clear();

            for (int i = 0; o[i] != null && i < o.Length; i++) {
                _sb.AppendLine(o[i].GetHashCode().ToString() + "_");
            }
            return _sb.ToString();
        }
    }
}