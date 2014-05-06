; (function (ng) {
	'use strict';

	// documentation https://vk.com/dev
	// version api 5.21

	var vkProvider = ng.module('vk.provider', []);

	vkProvider.provider('vkProvider', function () {

		// CONFIG ======================================================
		var that = this;

		// ON or OFF loggin call service
		this.loggerFlag = true;
		this.setLogger = function(value) {
			this.loggerFlag = value;
		};

		// TOKEN for auth
		this.token = '';
		this.setToken = function (value) {
			this.token = value;
		};

		this.$get = function ($http, $q, $log) {

			// SUPPORT ======================================================
			var ROOT = function (path) { return 'https://api.vk.com/method/' + path + '?access_token=' + that.token; };

			var call = function (method, params) {
				$log.debug([new Date().toLocaleTimeString(), method, 'send', params]);
				var path = ROOT(method) + params + '&callback=JSON_CALLBACK';

				var deferred = $q.defer();
				$http.jsonp(path).success(function (data) {
					deferred.resolve(data.response);
					$log.debug([new Date().toLocaleTimeString(), method, 'return', data.response]);
				}).error(function (err) {
					deferred.reject(err);
					$log.debug([new Date().toLocaleTimeString(), method, 'error', err]);
				});
				return deferred.promise;
			};

			// USERS ======================================================
			var users = {
				// Returns detailed information on users. http://vk.com/dev/users.get
				get: function (p) {
					return call('users.get', p);
				},

				// Returns a list of users matching the search criteria. - http://vk.com/dev/users.search
				search: function (p) {
					return call('users.search', p);
				},

				// Returns a list of IDs of users and communities followed by the user. - http://vk.com/dev/users.isAppUser
				isAppUser: function (p) {
					return call('users.isAppUser', p);
				},

				// Returns a list of IDs of users and communities followed by the user. - http://vk.com/dev/users.getSubscriptions
				getSubscriptions: function (p) {
					return call('users.getSubscriptions', p);
				},

				// Returns a list of IDs of followers of the user in question, sorted by date added, most recent first. - http://vk.com/dev/users.getFollowers
				getFollowers: function (p) {
					return call('users.getFollowers', p);
				},
			};

			// GROUPS ======================================================
			var groups = {
				// Returns information specifying whether a user is a member of a community. - http://vk.com/dev/groups.isMember
				isMember: function (p) {
					return call('groups.isMember', p);
				},

				// Returns information about communities by their IDs. - http://vk.com/dev/groups.getById
				getById: function (p) {
					return call('groups.getById', p);
				},

				// Returns a list of the communities to which a user belongs. - http://vk.com/dev/groups.get
				get: function (p) {
					return call('groups.get', p);
				},

				// Returns a list of community members. - http://vk.com/dev/groups.getMembers
				getMembers: function (p) {
					return call('groups.getMembers', p);
				},

				// Searches for communities by substring. - http://vk.com/dev/groups.search
				search: function (p) {
					return call('groups.search', p);
				},
			};

			// FRIENDS ======================================================
			var friends = {
				// Returns a list of user IDs or detailed information about a user's friends. - http://vk.com/dev/friends.get
				get: function (p) {
					return call('friends.get', p);
				},

				// Returns a list of user IDs of a user's friends who are online. - http://vk.com/dev/friends.getOnline
				getOnline: function (p) {
					return call('friends.getOnline', p);
				},

				// Returns a list of user IDs of the mutual friends of two users. - http://vk.com/dev/friends.getMutual
				getMutual: function (p) {
					return call('friends.getMutual', p);
				},

				// Returns a list of user IDs of the current user's recently added friends. - http://vk.com/dev/friends.getRecent
				getRecent: function (p) {
					return call('friends.getRecent', p);
				},

				// Returns a list of IDs of the current user's friends who installed the application. - http://vk.com/dev/friends.getAppUsers
				getAppUsers: function () {
					return call('friends.getAppUsers', '');
				},

				// Checks the current user's friendship status with other specified users. - http://vk.com/dev/friends.areFriends
				areFriends: function (p) {
					return call('friends.areFriends', p);
				},
			};

			// WALL ======================================================
			var wall = {
				//	Returns a list of posts on a user wall or community wall. - http://vk.com/dev/wall.get
				get: function (p) {
					return call('wall.get', p);
				},

				//	Returns a list of posts from user or community walls by their IDs. - http://vk.com/dev/wall.getById
				getById: function (p) {
					return call('wall.getById', p);
				},

				//	Returns information about reposts of a post on user wall or community wall. - http://vk.com/dev/wall.getReposts
				getReposts: function (p) {
					return call('wall.getReposts', p);
				},

				//	Returns a list of comments on a post on a user wall or community wall. - http://vk.com/dev/wall.getComments
				getComments: function (p) {
					return call('wall.getComments', p);
				}
			};

			var photos = {

				//  Returns a list of a user's or community's photo albums. - http://vk.com/dev/photos.getAlbums
				getAlbums: function (p) {
					return call('photos.getAlbums', p);
				},
				
				//	Returns a list of a user's or community's photos. - http://vk.com/dev/photos.get
				get: function (p) {
					return call('photos.get', p);
				},
				
				//	Returns the number of photo albums belonging to a user or community. - http://vk.com/dev/photos.getAlbumsCount
				getAlbumsCount: function(p) {
					return call('photos.getAlbumsCount', p);
				},
				
				//	Returns a list of photos from a user's or community's page. - http://vk.com/dev/photos.getProfile
				getProfile: function(p) {
					return call('photos.getProfile', p);
				},
				
				//	Returns information about photos by their IDs. - http://vk.com/dev/photos.getById
				getById: function(p) {
					return call('photos.getById', p);
				},
				
				//	Returns a list of photos. - http://vk.com/dev/photos.search
				search: function(p) {
					return call('photos.search', p);
				},
				
				//	Returns a list of photos belonging to a user or community, in reverse chronological order.. - http://vk.com/dev/photos.getAll
				getAll: function(p) {
					return call('photos.getAll', p);
				},
				
				//	Returns a list of photos in which a user is tagged. - http://vk.com/dev/photos.getUserPhotos
				getUserPhotos: function (p) {
					return call('photos.getUserPhotos', p);
				},
				
				//	Returns a list of comments on a photo. - http://vk.com/dev/photos.getComments
				getComments: function (p) {
					return call('photos.getComments', p);
				},
				
				//	Returns a list of comments on a photo. - http://vk.com/dev/photos.getAllComments
				getAllComments: function (p) {
					return call('photos.getAllComments', p);
				},
			};

			var video = {
				
				//	Returns detailed information about videos. - http://vk.com/dev/video.get
				get: function (p) {
					return call('video.get', p);
				},
				
				//	Returns a list of videos under the set search criterion. - http://vk.com/dev/video.search
				search: function (p) {
					return call('video.search', p);
				},
				
				//	Returns list of videos in which the user is tagged. - http://vk.com/dev/video.getUserVideos
				getUserVideos: function (p) {
					return call('video.getUserVideos', p);
				},

				//	Returns a list of video albums owned by a user or community. - http://vk.com/dev/video.getAlbums
				getAlbums: function (p) {
					return call('video.getAlbums', p);
				},
				
				//	Returns a list of comments on a video. - http://vk.com/dev/video.getComments
				getComments: function (p) {
					return call('video.getComments', p);
				},
				
				//	Adds a new comment on a video. - http://vk.com/dev/video.createComment
				createComment: function (p) {
					return call('video.createComment', p);
				},
				
				//	Deletes a comment on a video. - http://vk.com/dev/video.deleteComment
				deleteComment: function (p) {
					return call('video.deleteComment', p);
				},
				
				//	Restores a previously deleted comment on a video. - http://vk.com/dev/video.restoreComment
				restoreComment: function (p) {
					return call('video.restoreComment', p);
				},
				
				//	Edits the text of a comment on a video. - http://vk.com/dev/video.editComment
				editComment: function (p) {
					return call('video.editComment', p);
				},
				
				//	Returns a list of tags on a video. - http://vk.com/dev/video.getTags
				getTags: function (p) {
					return call('video.getTags', p);
				},
				
				//	Adds a tag on a video. - http://vk.com/dev/video.putTag
				putTag: function (p) {
					return call('video.putTag', p);
				},
				
				//	Removes a tag from a video. - http://vk.com/dev/video.removeTag
				removeTag: function (p) {
					return call('video.removeTag', p);
				},
				
				//	Returns a list of videos with tags that have not been viewed. - http://vk.com/dev/video.getNewTags
				getNewTags: function (p) {
					return call('video.getNewTags', p);
				},
			};


			// ======================================================

			return {
				users: users,
				groups: groups,
				friends: friends,
				wall: wall,
				photos: photos,
				video: video,
			};
		}
	});

})(angular);

