/**
 * Created by Administrator on 2016/06/20.
 * 职员信息表示画面Controller
 */

/// <reference path='../../dtoinfo/staff.ts' />

namespace app {
    'use strict'

    export class StaffInformationController {
        private isDelDisable: boolean = false;
        private isUpdDisable: boolean = false;
        private staff: Staff = undefined;
        private staffShareService: StaffShareService = undefined;

        /**
         * The constructor.
         *
         * @param $http
         * @param $stateParams
         * @param $cookie
         * @param $state
         * @param COMPETENCE
         */
        constructor( private $http: angular.IHttpService,
                     private $stateParams: any,
                     private $cookies: any,
                     private $state: angular.ui.IStateService,
                     private COMPETENCE: any)
        {
            this.init();
        }

        /**
         * Initialize the staff info view.
         */
        private init() {
            if(this.$cookies.put.length > 0) {
                // 取出cookies中的登录信息
                let userName = this.$cookies.get('userInfo');
                // 确认当前用户权限Flg
                if (userName === 'SSJ0001') {
                    // 登录用户权限=0，【消除】和【变更】按钮无效
                    this.isDelDisable = true;
                    this.isUpdDisable = true;
                }
            }

            // Get the staff info from $stateParams.
            //this.staff = JSON.parse(this.$stateParams['param']);
            this.staff = JSON.parse(window.localStorage['staff']);
        }

        /**
         * Delete the staff information.
         */
        delete() {
            // 从StaffShareService中删除指定职员信息。（window.open方式打开该画面，通过依赖注入方式创建的StaffShareService对象，此刻可能已经不是单实例对象了。）
            //this.staffShareService.delete(this.staff);
            window.close();
            window.dispatchEvent(new Event('DELETE-STAFF'));
        }

        /**
         * Go to the staff modify view.
         */
        update() {
            let nowDate:any = [];
            nowDate = this.staff;
            this.$state.go('modify', { param : JSON.stringify(nowDate) }, {location: false});
        }

        /**
         * Close the view.
         */
        close() {
            this.clear();
            window.close();
        }

        private clear() {
            window.localStorage.clear();
        }
    }
}
