using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace Visualization_Samples.Controllers
{
	public class TestController : ApiController
	{
		public HttpResponseMessage Get()
		{
			string filePath = System.Web.HttpContext.Current.Request.PhysicalApplicationPath;
			var sb = new StringBuilder();
			using (var sr = new StreamReader(filePath + "friends.txt"))
			{
				String line;
				while ((line = sr.ReadLine()) != null)
				{
					sb.AppendLine(line);
				}
			}

			return Request.CreateResponse(HttpStatusCode.OK, sb.ToString(), Configuration.Formatters.JsonFormatter);
		}
	}
}
