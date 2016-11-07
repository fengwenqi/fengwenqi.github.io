var app;
(function (app) {
    'use strict';
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    app.angularModule = angular.module('app', ['ui.router',
        'ui.grid',
        'ui.grid.edit',
        'ngMockE2E',
        'ngCookies',
        'list.filter']);
    var defaultPageState = 'login';
    app.angularModule.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/' + defaultPageState);
        $stateProvider
            .state('login', {
            url: '/login',
            templateUrl: 'controllers/login/login.html',
            controller: app.LoginController,
            controllerAs: 'vm'
        })
            .state('list', {
            url: '/list',
            templateUrl: 'controllers/list/staffList.html',
            controller: app.StaffListController,
            controllerAs: 'vm'
        })
            .state('info', {
            url: '/info/:param',
            templateUrl: 'controllers/information/staffInformation.html',
            controller: app.StaffInformationController,
            controllerAs: 'vm'
        })
            .state('modify', {
            url: '/modify/:param',
            templateUrl: 'controllers/modify/staffModify.html',
            controller: app.StaffModifyController,
            controllerAs: 'vm'
        });
    });
    app.angularModule.run(function ($http, $httpBackend, staffShareService) {
        var staffs = undefined;
        $http({ method: 'GET', url: '../public/json/staffs.json' })
            .then(function (response) {
            staffs = response.data.staffs;
            staffShareService.set(staffs);
        });
        $httpBackend.whenGET(/\.html$/).passThrough();
        $httpBackend.whenGET(/\.json$/).passThrough();
    });
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    var BUSINESS;
    (function (BUSINESS) {
        BUSINESS[BUSINESS["BS_ADD"] = 1] = "BS_ADD";
        BUSINESS[BUSINESS["BS_UPDATE"] = 2] = "BS_UPDATE";
    })(BUSINESS || (BUSINESS = {}));
    app.LEVEL = [
        { id: '0', value: '' },
        { id: '1', value: 'PM' },
        { id: '2', value: 'PL' },
        { id: '3', value: '技术SE' },
        { id: '4', value: '业务SE' },
        { id: '5', value: 'PG' }
    ];
    app.SEX = [
        { id: '0', value: '全部' },
        { id: '1', value: '男' },
        { id: '2', value: '女' }
    ];
    app.WORK_FLAG = [
        { id: '0', value: '×' },
        { id: '1', value: '○' }
    ];
    app.LANGUAGE = [
        { id: '1', value: '日语' },
        { id: '2', value: '英语' },
    ];
    app.AUTHORITY = [
        { id: '0', value: '普通用户' },
        { id: '9', value: '管理者' }
    ];
    app.angularModule.constant('COMPETENCE', {
        'ZERO': '0',
        'NINE': '9'
    });
    app.getLevelValue = function (id) {
        return app.getValue(app.LEVEL, id);
    };
    app.getSexValue = function (id) {
        return app.getValue(app.SEX, id);
    };
    app.getWorkFlagValue = function (id) {
        return app.getValue(app.WORK_FLAG, id);
    };
    app.getLanguageValue = function (id) {
        var lanNmStr = "";
        if (id && typeof id == "string") {
            var lanArr = id.split(",");
            if (lanArr && lanArr instanceof Array) {
                lanArr.forEach(function (item, index) {
                    lanNmStr += (app.getValue(app.LANGUAGE, item) + ", ");
                });
                if (lanNmStr.length > 0) {
                    lanNmStr = lanNmStr.slice(0, lanNmStr.length - 2);
                }
            }
        }
        return lanNmStr;
    };
    app.getValue = function (obj, id) {
        if (obj && obj instanceof Array) {
            for (var i = 0; i < obj.length; ++i) {
                if (obj[i].id === id) {
                    return obj[i].value;
                }
            }
        }
        return undefined;
    };
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    var StaffInformationController = (function () {
        function StaffInformationController($http, $stateParams, $cookies, $state, COMPETENCE) {
            this.$http = $http;
            this.$stateParams = $stateParams;
            this.$cookies = $cookies;
            this.$state = $state;
            this.COMPETENCE = COMPETENCE;
            this.isDelDisable = false;
            this.isUpdDisable = false;
            this.staff = undefined;
            this.staffShareService = undefined;
            this.init();
        }
        StaffInformationController.prototype.init = function () {
            if (this.$cookies.put.length > 0) {
                var userName = this.$cookies.get('userInfo');
                if (userName === 'SSJ0001') {
                    this.isDelDisable = true;
                    this.isUpdDisable = true;
                }
            }
            this.staff = JSON.parse(window.localStorage['staff']);
        };
        StaffInformationController.prototype.delete = function () {
            window.close();
            window.dispatchEvent(new Event('DELETE-STAFF'));
        };
        StaffInformationController.prototype.update = function () {
            var nowDate = [];
            nowDate = this.staff;
            this.$state.go('modify', { param: JSON.stringify(nowDate) }, { location: false });
        };
        StaffInformationController.prototype.close = function () {
            this.clear();
            window.close();
        };
        StaffInformationController.prototype.clear = function () {
            window.localStorage.clear();
        };
        return StaffInformationController;
    }());
    app.StaffInformationController = StaffInformationController;
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    var Userinfo = (function () {
        function Userinfo() {
        }
        return Userinfo;
    }());
    var Competence = (function () {
        function Competence() {
        }
        return Competence;
    }());
    app.Competence = Competence;
    var LoginController = (function () {
        function LoginController($state, $rootScope, $cookies, COMPETENCE) {
            this.$state = $state;
            this.$rootScope = $rootScope;
            this.$cookies = $cookies;
            this.COMPETENCE = COMPETENCE;
            this.dto = {
                username: '',
                password: '',
                submitting: false,
                submitStatus: false
            };
            if ($cookies.put.length > 0) {
                this.dto.username = $cookies.get('userInfo');
                this.dto.password = $cookies.get('pwdInfo');
                if (this.dto.username === 'SSJ0001') {
                    this.$rootScope.competence = COMPETENCE.ZERO;
                    $state.go('list');
                }
                else if (this.dto.username === 'SSJ9999') {
                    this.$rootScope.competence = COMPETENCE.NINE;
                    $state.go('list');
                }
            }
        }
        LoginController.prototype.login = function (valid) {
            this.dto.submitStatus = true;
            if (valid) {
                if (this.dto.username === 'SSJ0001' && this.dto.password === 'lzt') {
                    this.$rootScope.competence = this.COMPETENCE.ZERO;
                    this.$cookies.put('userInfo', this.dto.username);
                    this.$cookies.put('pwdInfo', this.dto.password);
                    this.dto.submitting = true;
                    this.$state.go('list');
                }
                else if (this.dto.username === 'SSJ9999' && this.dto.password === 'lzt') {
                    this.$rootScope.competence = this.COMPETENCE.NINE;
                    this.$cookies.put('userInfo', this.dto.username);
                    this.$cookies.put('pwdInfo', this.dto.password);
                    this.dto.submitting = true;
                    this.$state.go('list');
                }
                else {
                    alert('对不起，您没有操作系统的权限！');
                }
            }
        };
        return LoginController;
    }());
    app.LoginController = LoginController;
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    var StaffListController = (function () {
        function StaffListController($http, $filter, $stateParams, $rootScope, $state, $cookies, $scope, COMPETENCE, staffShareService) {
            this.$http = $http;
            this.$filter = $filter;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$cookies = $cookies;
            this.$scope = $scope;
            this.COMPETENCE = COMPETENCE;
            this.staffShareService = staffShareService;
            this.isAddDisable = false;
            this.levelList = app.LEVEL;
            this.searchKey = {
                id: undefined,
                name: undefined,
                level: app.LEVEL[0].id,
                sex: app.SEX[0].id
            };
            this.searchCount = 0;
            this.staffs = [];
            this._gridApi = null;
            this.gridOptions = {
                columnDefs: [
                    { name: '工号', field: 'id', headerCellClass: 'gridHeaderCell', cellClass: 'gridCell', enableColumnMenu: false, enableSorting: false,
                        cellTemplate: '<div style="margin:5px;"><a ng-click="grid.appScope.vm.goToInfoView(row.entity.id, \'info\', \'2\' )">{{row.entity.id}}</a></div>' },
                    { name: '姓名', field: 'name', headerCellClass: 'gridHeaderCell', enableColumnMenu: false, enableSorting: false },
                    { name: '级别', field: 'levelNm', headerCellClass: 'gridHeaderCell', cellClass: 'gridCell', enableColumnMenu: false, enableSorting: false },
                    { name: '性别', field: 'sexNm', headerCellClass: 'gridHeaderCell', cellClass: 'gridCell', enableColumnMenu: false, enableSorting: false },
                    { name: '资产编号', field: 'assetNum', headerCellClass: 'gridHeaderCell', cellClass: 'gridCell', enableColumnMenu: false, enableSorting: false },
                    { name: '工作地点', field: 'workPlace', headerCellClass: 'gridHeaderCell', enableColumnMenu: false, enableSorting: false }
                ],
                data: 'vm.staffs',
                enableRowHashing: false,
                onRegisterApi: this.funA()
            };
            this.userInfo = {
                userinfo: '',
                pwdinfo: ''
            };
            this.init();
        }
        StaffListController.prototype.funA = function () {
            var ctrl = this;
            return function (gridApi) {
                ctrl._gridApi = gridApi;
            };
        };
        ;
        StaffListController.prototype.init = function () {
            if (this.$rootScope.competence === this.COMPETENCE.ZERO) {
                this.isAddDisable = true;
            }
        };
        StaffListController.prototype.search = function (valid) {
            if (valid) {
                var allStaffs = this.staffShareService.get();
                this.staffs = this.$filter('retrieveInfo')(allStaffs.concat(), this.searchKey);
                this.searchCount = this.staffs.length;
            }
        };
        StaffListController.prototype.add = function (goPage, pageStatus) {
            this.goToInfoView(null, pageStatus, goPage);
        };
        StaffListController.prototype.logout = function () {
            this.$cookies.remove('userInfo');
            this.$cookies.remove('pwdInfo');
            this.$cookies.remove('pageStatus');
            this.$state.go('login');
        };
        StaffListController.prototype.goToInfoView = function (staffId, goPage, status) {
            var _this = this;
            var _staffs = [];
            var newPageName = '_add';
            if (status === '2') {
                newPageName = '_blank';
                this.$cookies.put('pageStatus', status);
                _staffs = this.$filter('retrieveInfo')(this.staffs.concat(), { id: staffId });
            }
            else if (status === '1') {
                this.$cookies.put('pageStatus', status);
            }
            var url = this.$state.href(goPage);
            var width = 1024;
            var height = 768;
            var left = (window.screen.availWidth - width) / 2;
            var top = (window.screen.availHeight - height) / 2;
            var staffInfoWin = window.open(url, newPageName, 'width=' + width + ', height=' + height + ', left=' + left + ', top=' + top + ', resizable=no');
            staffInfoWin.localStorage['staff'] = JSON.stringify(_staffs[0]);
            staffInfoWin.addEventListener('SAVE-STAFF', function () {
                var addStaff = JSON.parse(window.localStorage['addStaff']);
                _this.staffShareService.save(addStaff);
                window.localStorage.clear();
                _this.search(true);
                _this.$scope.$apply();
            }, false);
            staffInfoWin.addEventListener('DELETE-STAFF', function () {
                var delStaff = JSON.parse(window.localStorage['staff']);
                _this.staffShareService.delete(delStaff);
                window.localStorage.clear();
                _this.search(true);
                _this.$scope.$apply();
            }, false);
            staffInfoWin.addEventListener('UPDATE-STAFF', function () {
                var updateStaff = JSON.parse(window.localStorage['updateStaff']);
                _this.staffShareService.update(updateStaff);
                window.localStorage.clear();
                _this.search(true);
                _this.$scope.$apply();
            }, false);
        };
        return StaffListController;
    }());
    app.StaffListController = StaffListController;
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    var StaffModifyController = (function () {
        function StaffModifyController($filter, $stateParams, $cookies, staffShareService, $state) {
            this.$filter = $filter;
            this.$stateParams = $stateParams;
            this.$cookies = $cookies;
            this.staffShareService = staffShareService;
            this.$state = $state;
            this.dto = {
                id: '',
                name: '',
                sex: '1',
                sexNm: '',
                age: null,
                workAge: 0,
                tel: '',
                eMail: '',
                level: null,
                levelNm: '',
                role: '',
                workPlace: '',
                assetNum: '',
                curProject: '',
                curProjectWorkTime: '',
                language: '',
                languageLevel: '',
                tecknology: '',
                workFlag: '1'
            };
            this.language = {
                jp: false,
                en: false
            };
            this.ps = {
                pageStatus: ''
            };
            this.levelList = app.LEVEL;
            this.staff = undefined;
            this.staffs = [];
            this.init();
        }
        StaffModifyController.prototype.init = function () {
            this.ps.pageStatus = this.$cookies.get('pageStatus');
            if (this.ps.pageStatus === '2') {
                this.staff = JSON.parse(this.$stateParams.param);
                this.dto = this.staff;
                this.parseLanguage(this.dto.language);
            }
        };
        StaffModifyController.prototype.save = function () {
            this.dto.language = this.getLanguage(this.language);
            if (this.ps.pageStatus === '1') {
                window.localStorage['addStaff'] = JSON.stringify(this.dto);
                window.dispatchEvent(new Event('SAVE-STAFF'));
            }
            else if (this.ps.pageStatus === '2') {
                window.localStorage['updateStaff'] = JSON.stringify(this.dto);
                window.dispatchEvent(new Event('UPDATE-STAFF'));
            }
            window.close();
        };
        StaffModifyController.prototype.getLanguage = function (language) {
            var strLanguage = undefined;
            if (language) {
                if (language.jp) {
                    strLanguage = "1";
                }
                if (language.en) {
                    if (strLanguage && strLanguage.length > 0) {
                        strLanguage += ",2";
                    }
                    else {
                        strLanguage = "2";
                    }
                }
            }
            return strLanguage;
        };
        StaffModifyController.prototype.parseLanguage = function (strLanguage) {
            if (strLanguage && strLanguage.length > 0) {
                var languageArr = strLanguage.split(',');
                if (languageArr && strLanguage.length > 0) {
                    if (languageArr[0] === '1') {
                        this.language.jp = true;
                    }
                    else if (languageArr[0] === '2') {
                        this.language.en = true;
                    }
                    if (languageArr[1] === '2') {
                        this.language.en = true;
                    }
                }
            }
        };
        StaffModifyController.prototype.close = function () {
            window.close();
            this.$state.go('list', { params: '' });
        };
        return StaffModifyController;
    }());
    app.StaffModifyController = StaffModifyController;
})(app || (app = {}));
app.angularModule.directive('setFocus', function () {
    return function (scope, element) {
        element[0].focus();
    };
});
var app;
(function (app) {
    'use strict';
    var HALFWORD_REGEXP = /^[\x00-\xff]*$/;
    app.angularModule.directive('halfWidth', function () {
        return {
            require: 'ngModel',
            link: function ($scope, iElm, iAttrs, controller) {
                controller.$parsers.unshift(function (viewValue) {
                    if (HALFWORD_REGEXP.test(viewValue)) {
                        controller.$setValidity('halfWidth', true);
                        return viewValue;
                    }
                    else {
                        controller.$setValidity('halfWidth', false);
                        return undefined;
                    }
                });
            }
        };
    });
})(app || (app = {}));
var app;
(function (app) {
    app.angularModule.directive('enterFocus', function () {
        return {
            link: function (scope, element, attr) {
                element.bind('keydown', function (event) {
                    return is_down(event) === undefined ? true : handle_element(this, is_down(event));
                });
            }
        };
    });
    function handle_element(field, is_down) {
        var elements = field.form.elements;
        for (var i = 0, len = elements.length - 1; i < len; i++) {
            if (field === elements[i]) {
                break;
            }
        }
        i = is_down ? (i + 1) % len : (i - 1) % len;
        if ((0 === i && is_down) || (-1 === i && !is_down)) {
            return true;
        }
        elements[i].focus();
        var element_arr = ['button', 'submit', 'reset', 'select-one', 'textarea'];
        if (element_arr.join(',').indexOf(elements[i].type) > -1) {
            elements[i].select();
        }
        return false;
    }
    function is_down(e) {
        var isDown;
        e = e || window.event;
        switch (e.keyCode) {
            case 13:
            case 39:
            case 40:
                isDown = true;
                break;
            case 37:
            case 38:
                isDown = false;
                break;
        }
        return isDown;
    }
})(app || (app = {}));
var app;
(function (app) {
    'usr strict';
    angular.module('list.filter', [])
        .filter('retrieveInfo', function () {
        return function (inputArray, aimsArray) {
            var array = [];
            var basis = 0;
            var filterArray = [];
            filterArray.push(aimsArray);
            console.log(filterArray[0].id);
            console.log(filterArray[0].name);
            console.log(filterArray[0].level);
            console.log(filterArray[0].sex);
            for (var k = 0; k < filterArray.length; k++) {
                if ((filterArray[k].id === undefined || filterArray[k].id === '' || filterArray[k].id === null) &&
                    (filterArray[k].name === undefined || filterArray[k].name === '' || filterArray[k].name === null) &&
                    (filterArray[k].level === '0' || filterArray[k].level === '' || filterArray[k].level === null) &&
                    (filterArray[k].sex === '0' || filterArray[k].sex === '' || filterArray[k].sex === null)) {
                    return inputArray;
                }
                else {
                    if (filterArray[k].id) {
                        basis = 0;
                        for (var i = 0; i < inputArray.length;) {
                            if (filterArray[k].id == inputArray[i].id) {
                                array[basis] = inputArray[i];
                                basis++;
                                i++;
                            }
                            else {
                                inputArray.splice(i, 1);
                            }
                        }
                        inputArray = array;
                    }
                    if (filterArray[k].name) {
                        basis = 0;
                        for (var i = 0; i < inputArray.length;) {
                            if (filterArray[k].name == inputArray[i].name) {
                                array[basis] = inputArray[i];
                                basis++;
                                i++;
                            }
                            else {
                                inputArray.splice(i, 1);
                            }
                        }
                        inputArray = array;
                    }
                    if (!(filterArray[k].level === '0') &&
                        filterArray[k].level !== "" &&
                        filterArray[k].level !== undefined) {
                        basis = 0;
                        for (var i = 0; i < inputArray.length;) {
                            if (filterArray[k].level == inputArray[i].level) {
                                array[basis] = inputArray[i];
                                basis++;
                                i++;
                            }
                            else {
                                inputArray.splice(i, 1);
                            }
                        }
                        inputArray = array;
                    }
                    if (!(filterArray[k].sex === '0') &&
                        filterArray[k].sex !== "" &&
                        filterArray[k].sex !== undefined) {
                        basis = 0;
                        for (var i = 0; i < inputArray.length;) {
                            if (filterArray[k].sex == inputArray[i].sex) {
                                array[basis] = inputArray[i];
                                basis++;
                                i++;
                            }
                            else {
                                inputArray.splice(i, 1);
                            }
                        }
                        inputArray = array;
                    }
                }
            }
            return array;
        };
    });
})(app || (app = {}));
var app;
(function (app) {
    'use strict';
    var StaffShareService = (function () {
        function StaffShareService() {
            this.staffs = undefined;
        }
        StaffShareService.prototype.get = function () {
            return this.staffs;
        };
        StaffShareService.prototype.set = function (staffs) {
            this.staffs = staffs;
            this.convCodeToValue(this.staffs);
        };
        StaffShareService.prototype.convCodeToValue = function (staffs) {
            if (staffs && staffs instanceof Array) {
                staffs.forEach(function (item, index) {
                    item.levelNm = app.getLevelValue(item.level);
                    item.sexNm = app.getSexValue(item.sex);
                    item.workFlagNm = app.getWorkFlagValue(item.workFlag);
                    item.languageNm = app.getLanguageValue(item.language);
                });
            }
        };
        StaffShareService.prototype.delete = function (staff) {
            for (var index = 0, count = this.staffs.length; index < count; ++index) {
                if (this.staffs[index].id == staff.id) {
                    this.staffs.splice(index, 1);
                    break;
                }
            }
        };
        StaffShareService.prototype.save = function (staff) {
            this.staffs.push(staff);
            this.convCodeToValue(this.staffs);
        };
        StaffShareService.prototype.update = function (staff) {
            if (this.staffs && this.staffs instanceof Array) {
                for (var index = 0, count = this.staffs.length; index < count; ++index) {
                    if (this.staffs[index].id == staff.id) {
                        this.staffs.splice(index, 1, staff);
                        break;
                    }
                }
                this.convCodeToValue(this.staffs);
            }
        };
        return StaffShareService;
    }());
    app.StaffShareService = StaffShareService;
    app.angularModule.service('staffShareService', StaffShareService);
})(app || (app = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2R0b2luZm8vc3RhZmYudHMiLCIuLi9zcmMvYXBwLnRzIiwiLi4vc3JjL2NvbW1vbi9jb25zdGFudHMudHMiLCIuLi9zcmMvY29udHJvbGxlcnMvaW5mb3JtYXRpb24vc3RhZmZJbmZvcm1hdGlvbi5jb250cm9sbGVyLnRzIiwiLi4vc3JjL2NvbnRyb2xsZXJzL2xvZ2luL2xvZ2luLmNvbnRyb2xsZXIudHMiLCIuLi9zcmMvY29udHJvbGxlcnMvbGlzdC9zdGFmZkxpc3QuY29udHJvbGxlci50cyIsIi4uL3NyYy9jb250cm9sbGVycy9tb2RpZnkvc3RhZmZNb2RpZnkuY29udHJvbGxlci50cyIsIi4uL3NyYy9kaXJlY3RpdmVzL2NvbW1vbi9zZXRGb2N1cy5kaXJlY3RpdmUudHMiLCIuLi9zcmMvZGlyZWN0aXZlcy9jb21tb24vdmFsaWRhdG9yLmRpcmVjdGl2ZS50cyIsIi4uL3NyYy9kaXJlY3RpdmVzL2xvZ2luL2VudGVyRm9jdXMuZGlyZWN0aXZlLnRzIiwiLi4vc3JjL2ZpbHRlcnMvbGlzdC9zdGFmZkxpc3QuZmlsdGVyLnRzIiwiLi4vc3JjL3NlcnZpY2VzL3N0YWZmU2hhcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxJQUFVLEdBQUcsQ0ErQ1o7QUEvQ0QsV0FBVSxHQUFHLEVBQUEsQ0FBQztJQUNWLFlBQVksQ0FBQztBQThDakIsQ0FBQyxFQS9DUyxHQUFHLEtBQUgsR0FBRyxRQStDWjtBQzNDRCxJQUFVLEdBQUcsQ0EwRFo7QUExREQsV0FBVSxHQUFHLEVBQUMsQ0FBQztJQUNYLFlBQVksQ0FBQTtJQUVELGlCQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXO1FBQ1gsU0FBUztRQUNULGNBQWM7UUFDZCxXQUFXO1FBQ1gsV0FBVztRQUNYLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFFbEUsSUFBSSxnQkFB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LENBQUMsS0FBSyxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQztvQkFDOUYsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQztvQkFFMUYsTUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDdEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDcEIsS0FBSyxHQUFHLENBQUMsQ0FBQzt3QkFDVixHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUUsQ0FBQzs0QkFDbkMsRUFBRSxDQUFBLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQztnQ0FDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDN0IsS0FBSyxFQUFFLENBQUM7Z0NBQ1IsQ0FBQyxFQUFFLENBQUM7NEJBQ1IsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDSixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDNUIsQ0FBQzt3QkFDTCxDQUFDO3dCQUNELFVBQVUsR0FBRyxLQUFLLENBQUM7b0JBQ3ZCLENBQUM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxD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