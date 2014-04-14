var module = angular.module('x.states', [
  'ui.router.state',
  'ui.router.router',
  'x.templates',
  'x.controllers.advice-and-resources',
  'x.controllers.post',
  'x.services.postTransformer'
]);

module.config(function($stateProvider) {

  $stateProvider
    .state('x', {
      abstract:    true,
      url:         '',
      templateUrl: 'project-x.tpl.html'
    })

    .state('x.advice-and-resources', {
      abstract:    true,
      url:         '/advice-and-resources',
      templateUrl: 'advice-and-resources/advice-and-resources.tpl.html'
    })

    .state('x.advice-and-resources.home', {
      url:          '',
      templateUrl:  'advice-and-resources/home.tpl.html',
      data: {title: 'Advice & Resources'},
      controller:   'AdviceAndResourcesCtrl'
    })

    .state('x.advice-and-resources.post', {
      url:         '/posts/:id',
      templateUrl: 'advice-and-resources/post.tpl.html',
      data:        {title: 'Post'},
      controller:  'PostCtrl',
      resolve: {
        post: function(cortex, postTransformer, $stateParams, $q) {
          var d = $q.defer();

          cortex.posts.get({id: $stateParams.id}).$promise.then(function(post) {
            postTransformer.transform(post);
            d.resolve(post);
          });

          return d.promise;
        }
      }
    });
});
