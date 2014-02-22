using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;

namespace Visualization_Samples.Controllers
{
	public class VkController : Controller
	{
		public ActionResult Posts()
		{
			if (!Request.QueryString["id"].IsEmpty())
			{
				ViewBag.ID = Request.QueryString["id"];
			}

			return View("Posts", "_SecondLayout");
		}

		public ActionResult Profiles()
		{
			if (!Request.QueryString["id"].IsEmpty())
			{
				ViewBag.ID = Request.QueryString["id"];
			}

			return View("profiles", "_SecondLayout");
		}

		public ActionResult Groups()
		{
			return View("groups", "_SecondLayout");
		}

		public ActionResult Test()
		{
			if (!Request.QueryString["id"].IsEmpty())
			{
				ViewBag.ID = Request.QueryString["id"];
			}

			return View("test", "_SecondLayout");
		}
	}
}
