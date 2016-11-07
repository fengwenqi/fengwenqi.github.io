/**
 * Created by xuweiyu on 2016/06/20.
 * angular 模块配置和启动
 */

/// <reference path="./typings/tsd.d.ts" />
/// <reference path='./dtoinfo/staff.ts' />
namespace app {
    'use strict'

    export var angularModule = angular.module('app', ['ui.router',
                                                      'ui.grid',
                                                      'ui.grid.edit',
                                                      'ngMockE2E',
                                                      'ngCookies',
                                                      'list.filter']);

    let defaultPageState = 'login';
    angularModule.config(function (
        $stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider) {
        $urlRouterProvider.otherwise('/' + defaultPageState);
        $stateProvider
            .state('login',{
                url:'/login',
                templateUrl: 'controllers/login/login.html',
                controller: LoginController,
                controllerAs: 'vm'
            })
            .state('list', {
                url: '/list',
                templateUrl: 'controllers/list/staffList.html',
                controller: StaffListController,
                controllerAs: 'vm'
            })
            .state('info', {
                url: '/info/:param',
                templateUrl: 'controllers/information/staffInformation.html',
                controller: StaffInformationController,
                controllerAs: 'vm'
            })
            .state('modify', {
                url: '/modify/:param',
                templateUrl: 'controllers/modify/staffModify.html',
                controller: StaffModifyController,
                controllerAs: 'vm'
            })
    });

    angularModule.run(function( $http: angular.IHttpService,
                                $httpBackend: angular.IHttpBackendService,
                                staffShareService: StaffShareService
    ){
        let staffs: Array<Staff> = undefined;
        $http({method: 'GET', url: '../public/json/staffs.json'})
            .then((response: any) => {
                staffs = response.data.staffs;
                //$httpBackend.whenGET('/searchStaff').respond(staffs);
                // 从staffs.json获取职员信息，并保存在StaffShareService中。
                staffShareService.set(staffs);
            });

        $httpBackend.whenGET(/\.html$/).passThrough(); // Requests for .html are handled by the real server
        $httpBackend.whenGET(/\.json$/).passThrough(); // Requests for .json are handled by the real server
    });
}
