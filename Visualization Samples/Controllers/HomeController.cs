using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.WebPages;
using Microsoft.Ajax.Utilities;

namespace Visualization_Samples.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult SecondGraph()
		{
			return View();
		}

		public ActionResult Hexagon()
		{
			return View();
		}

		public ActionResult Сonfetti()
		{
			return View();
		}

		public ActionResult PersonTest()
		{
			if (!Request.QueryString["id"].IsEmpty())
			{
				ViewBag.ID = Request.QueryString["id"];
			}

			return View("PersonTest", "_SecondLayout");
		}
	}
}
