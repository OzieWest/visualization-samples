using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DotNetOpenAuth.OpenId.Extensions.AttributeExchange;

namespace Visualization_Samples.Controllers
{
	public class DNode
	{
		public String name { get; set; }
		public int group { get; set; }
	}

	public class DLink
	{
		public int source { get; set; }
		public int target { get; set; }
		public int value { get; set; }
	}

	public class DData
	{
		public List<DNode> nodes { get; set; }
		public List<DLink> links { get; set; }

		public DData()
		{
			nodes = new List<DNode>();
			links = new List<DLink>();
		}
	}

	public class DataController : ApiController
	{
		static readonly Random Rnd = new Random();
		public static DData Data { get; set; }

		static DataController()
		{
			Data = new DData();

			for (int i = 0; i < 20; i++)
				Data.nodes.Add(new DNode { name = _randomName(), group = Rnd.Next(1, 20) });

			for (int i = 0; i < 50; i++)
				Data.links.Add(new DLink { source = Rnd.Next(1, 70), value = Rnd.Next(1, 30), target = Rnd.Next(1, 40) });
		}

		public HttpResponseMessage Get()
		{
			return Request.CreateResponse(HttpStatusCode.OK, Data, Configuration.Formatters.JsonFormatter);
		}

		public string Get(int id)
		{
			return "value";
		}

		public static string _randomName()
		{
			return Path.GetRandomFileName().Replace(".", "");
		}
	}
}
