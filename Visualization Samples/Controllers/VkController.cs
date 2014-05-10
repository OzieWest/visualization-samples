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

			return View("Posts");
		}

		public ActionResult Profiles()
		{
			if (!Request.QueryString["id"].IsEmpty())
			{
				ViewBag.ID = Request.QueryString["id"];
			}

			return View("profiles");
		}

		public ActionResult Groups()
		{
			return View("groups");
		}
	}
}
