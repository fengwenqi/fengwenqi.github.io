/**
 * Created by Administrator on 2016/06/20.
 * 职员一览画面Controller
 */

/// <reference path='../../common/constants.ts' />
/// <reference path='../../dtoinfo/staff.ts' />
/// <reference path='../login/login.controller.ts' />
namespace app {
    'use strict'

    interface SearchKey {
        // 工号
        id: string;
        // 工号
        name: string;
        // 工号
        level: string;
        // 性别
        sex: string;
    }
    export class StaffListController {
        private isAddDisable: boolean = false;
        private levelList: Array<ICode> = LEVEL;
        private searchKey: SearchKey = {
            id: undefined,
            name: undefined,
            level: LEVEL[0].id,
            sex: SEX[0].id
        };
        private searchCount: number = 0;
        private staffs: Array<Staff> = [];

        private _gridApi:uiGrid.IGridApi = null;
        private funA(){
            let ctrl = this;
            return (gridApi: uiGrid.IGridApi)=>{
                ctrl._gridApi = gridApi;
            };
        };
        private gridOptions: uiGrid.IGridOptions = {
            columnDefs: [
                {name: '工号', field: 'id', headerCellClass:'gridHeaderCell', cellClass:'gridCell', enableColumnMenu: false, enableSorting: false,
                    cellTemplate: '<div style="margin:5px;"><a ng-click="grid.appScope.vm.goToInfoView(row.entity.id, \'info\', \'2\' )">{{row.entity.id}}</a></div>'},
                {name: '姓名', field: 'name', headerCellClass:'gridHeaderCell', enableColumnMenu: false, enableSorting: false},
                {name: '级别', field: 'levelNm', headerCellClass:'gridHeaderCell', cellClass:'gridCell', enableColumnMenu: false, enableSorting: false},
                {name: '性别', field: 'sexNm', headerCellClass:'gridHeaderCell', cellClass:'gridCell', enableColumnMenu: false, enableSorting: false},
                {name: '资产编号', field: 'assetNum', headerCellClass:'gridHeaderCell', cellClass:'gridCell', enableColumnMenu: false, enableSorting: false},
                {name: '工作地点', field: 'workPlace', headerCellClass:'gridHeaderCell', enableColumnMenu: false, enableSorting: false}
            ],
            data: 'vm.staffs',
            enableRowHashing: false,  // 设置false：不允许给data添加hashkey，改变数据内容时，grid会刷新；设置true，给data添加hashkey，通过splice方式改变data内容时，grid不刷新。
            onRegisterApi: this.funA()
        };

        /**
         * The constructor function.
         *
         * @param $http
         * @param $filter
         * @param $stateParams
         * @param $rootScope
         * @param $state
         */
        userInfo : any = {
            userinfo:'',
            pwdinfo:''
        };

        constructor( private $http: angular.IHttpService,
                       private $filter: any,
                       $stateParams: any,
                       private $rootScope: Competence,
                       private $state: angular.ui.IStateService,
                       private $cookies: any,
                       private $scope: angular.IScope,
                       private COMPETENCE: any,
                       private staffShareService: StaffShareService
        ){
            this.init();
        }

        /**
         * Initialize the staff list view.
         */
        private init() {
            if (this.$rootScope.competence === this.COMPETENCE.ZERO) {
                // 登录用户权限=0，【追加】按钮无效
                this.isAddDisable = true;
            }
        }

        /**
         * Search staff infos by the specified searck keys.
         */
        //search(valid: any) {
        //    if (valid) {
        //        this.$http.get('/searchStaff').then((response: any) => {
        //            // 获取全部的职员信息。
        //            this.staffs = angular.fromJson(response.data);
        //
        //            // 根据检索条件，检索出指定的职员信息。
        //            this.staffs = this.$filter('retrieveInfo')(this.staffs, this.searchKey);
        //
        //            // 检索出职员的个数。
        //            this.searchCount = this.staffs.length;
        //        });
        //    }
        //}

        search(valid: any) {
            if (valid) {
                // 从StaffShareService获取职员信息.
                let allStaffs = this.staffShareService.get();

                // 根据检索条件，检索出指定的职员信息。
                this.staffs = this.$filter('retrieveInfo')(allStaffs.concat(), this.searchKey);

                // 检索出职员的个数。
                this.searchCount = this.staffs.length;
            }
        }

        /**
         * Go to the staff modify view.
         * @param pageStatus 迁移元标识Flg(1：追加，2：变更)
         */
        add(goPage: string, pageStatus: string) {
            this.goToInfoView(null, pageStatus, goPage);
            // this.$state.go('modify', {param: pageStatus});
        }

        /**
         * log out.
         */
        logout() {
            this.$cookies.remove('userInfo');
            this.$cookies.remove('pwdInfo');
            this.$cookies.remove('pageStatus');
            this.$state.go('login');
        }

        /**
         * Go to the staff info view.
         *
         * @param staffId The staff id.
         * @param status 迁移元标识Flg(1：追加，2：变更)
         * @param goPage 跳转页
         */
        goToInfoView(staffId: string, goPage?: string, status?: string) {
            let _staffs: Array<Staff> = [];
            let newPageName = '_add';
            // 状态( 1:追加,2:变更 )
            if (status === '2') {
                // open window name
                newPageName = '_blank';
                // 将页面迁移的状态存入到Cookies中( 1:追加,2:变更 )
                this.$cookies.put('pageStatus',status);
                // Get the specified staff info by the staff id.
                _staffs = this.$filter('retrieveInfo')(this.staffs.concat(), {id: staffId});
            } else if (status === '1'){
                // 将页面迁移的状态存入到Cookies中( 1:追加,2:变更 )
                this.$cookies.put('pageStatus',status);
            }

            // Go to the staff info view.
            //this.$state.go('info', {param: JSON.stringify(staffs[0])}, {location: false});
            //let url = this.$state.href('info', {param: JSON.stringify(staffs[0])});

            // Open the staff info view.
            let url = this.$state.href(goPage);
            let width = 1024;
            let height = 768;
            let left = (window.screen.availWidth-width)/2;
            let top = (window.screen.availHeight-height)/2;
            let staffInfoWin = window.open(url, newPageName, 'width='+width+', height='+height+', left='+left+', top='+top+', resizable=no');
            // Define the parameter.
            staffInfoWin.localStorage['staff'] = JSON.stringify(_staffs[0]);

            // Define the DELETE-STAFF event linstener.
            staffInfoWin.addEventListener('SAVE-STAFF', ()=>{
                // Delete the staff of the StaffShareService.
                let addStaff = JSON.parse(window.localStorage['addStaff']);
                this.staffShareService.save(addStaff);
                window.localStorage.clear();

                // ReSearch and refresh the staffList view.
                this.search(true);
                this.$scope.$apply();
            } , false);

            // Define the DELETE-STAFF event linstener.
            staffInfoWin.addEventListener('DELETE-STAFF', ()=>{
                // Delete the staff of the StaffShareService.
                let delStaff = JSON.parse(window.localStorage['staff']);
                this.staffShareService.delete(delStaff);
                window.localStorage.clear();

                // ReSearch and refresh the staffList view.
                this.search(true);
                this.$scope.$apply();
            } , false);

            // Define the DELETE-STAFF event linstener.
            //let ctrl = this;
            staffInfoWin.addEventListener('UPDATE-STAFF', ()=>{
                // 变更后的数据
                let updateStaff = JSON.parse(window.localStorage['updateStaff']);
                this.staffShareService.update(updateStaff);
                window.localStorage.clear();

                // ReSearch and refresh the staffList view.
                this.search(true);
                //ctrl._gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
                //ctrl._gridApi.core.refresh();
                this.$scope.$apply();
            } , false);
        }
    }
}
