'use sctrict';

var mainService = angular.module('vis.service', []);
var ROOT = function (method) { return 'https://api.vk.com/method/' + method + '?access_token=' + token; };

mainService.factory('vkService', function ($http, $q) {
	return {
		usersGet: function (_uids) {
			var deferred = $q.defer();
			var path = ROOT('users.get') + '&uids=' + _uids + '&fields=sex,bdate,city,country,lists,screen_name,has_mobile,contacts,education,universities,schools,can_post,can_see_all_posts,can_write_private_message,status,last_seen,relation,counters,nickname=';
			var p = $http.jsonp(path + '&callback=JSON_CALLBACK');
			p.success(function (data) {
				console.info('usersGet', 'return', data.response);
				deferred.resolve(data.response);
			});
			p.error(function (err) {
				console.error('usersGet error', err);
				deferred.reject();
			});
			return deferred.promise;
		},
		wallGet: function (_ownerId, _offset, _count, _filter, _extended) {
			var deferred = $q.defer();
			var path = ROOT('wall.get') + '&count=' + _count + '&offset=' + _offset + '&owner_id=' + _ownerId;
			var p = $http.jsonp(path + '&callback=JSON_CALLBACK');
			p.success(function (data) {
				deferred.resolve(data.response);
				console.info('wallGet', 'return', data.response);
			});
			p.error(function (err) {
				console.error('wallGet error', err);
				deferred.reject();
			});
			return deferred.promise;
		},
		friendsGet: function (_userId, _fields) {
			var deferred = $q.defer();
			var path = ROOT('friends.get') + '&user_id=' + _userId + "&fields=" + _fields;
			var p = $http.jsonp(path + '&callback=JSON_CALLBACK');
			p.success(function (data) {
				console.info('friendsGet', 'return', data.response);
				deferred.resolve(data.response);
			});
			p.error(function (err) {
				console.error('friendsGet error', err);
				deferred.reject();
			});
			return deferred.promise;
		},
		friendAllGet: function () {
			var test = {
				a: {},
				b: {}
			};
			
			//var a = ;
			//var a = getFriendCallback('1563369');

			setTimeout(getFriendCallback('169483251', test.a), 1000);
			setTimeout(getFriendCallback('1563369', test.a), 2000);

			return test;
		},
	};
});


function getFriendCallback($q, $http, id, prom) {
	var deferred = $q.defer();
	var path = ROOT('friends.get') + '&user_id=' + id;
	var p = $http.jsonp(path + '&callback=JSON_CALLBACK');
	p.success(function(data) {
		console.info('friendsGet', id, 'return', data.response);
		deferred.resolve(data.response);
	});
	p.error(function(err) {
		console.error('friendsGet error', err);
		deferred.reject();
	});
	prom = deferred.promise;
}