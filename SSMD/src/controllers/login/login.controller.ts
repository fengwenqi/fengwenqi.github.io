/**
 * Created by xuweiyu on 2016/06/20.
 * 登录画面Controller
 */

/// <reference path="../../app" />

namespace app {
    'use strict'

    class Userinfo {
        // 用户名
        username: string;
        // 密码
        password: string;
        // 登录/非登录切换
        submitting: boolean;
        // 登录按钮点击状态
        submitStatus: boolean;
    }

    /**
     * 权限类
     */
    export class Competence {
        // 权限
        competence: string;
    }

    /**
     * 登录画面处理逻辑
     */
    export class LoginController {

        dto: Userinfo = {
            // 用户名
            username: '',
            // 密码
            password: '',
            // 登录/非登录切换
            submitting: false,
            // 登录按钮点击状态
            submitStatus: false

        };

        /**
         * 构造方法
         * @param $state 路由跳转
         * @param $rootScope 根作用域
         */
        constructor(private $state: angular.ui.IStateService,
                    //private $rootScope: angular.IRootScopeService
                    private $rootScope: Competence,
                    private $cookies: any,
                    private COMPETENCE:any){

            // cookies中是否有登录信息
            if ($cookies.put.length > 0) {
                // 取出cookies中的登录信息
                this.dto.username = $cookies.get('userInfo');
                this.dto.password = $cookies.get('pwdInfo');

                // 确认当前用户权限Flg
                if (this.dto.username === 'SSJ0001') {
                    // 设置用户权限Flg
                    this.$rootScope.competence = COMPETENCE.ZERO;
                    // 画面跳转
                    $state.go('list');
                } else if (this.dto.username === 'SSJ9999') {
                    // 设置用户权限Flg
                    this.$rootScope.competence = COMPETENCE.NINE;
                    // 画面跳转
                    $state.go('list');
                }

            }
        }
        /**
         * 登录方法处理，及页面跳转设定
         * @param valid 表单验证状态(通过:true,未通过:false)
         */
        login(valid: any) {
            // 点击过登录按钮(为切换密码栏样式用)
            this.dto.submitStatus = true;

            if (valid) {
                if (this.dto.username === 'SSJ0001' && this.dto.password === 'lzt'){

                    // 设置用户权限Flg
                    this.$rootScope.competence = this.COMPETENCE.ZERO;
                    // 保存登录信息至cookies中
                    this.$cookies.put('userInfo', this.dto.username);
                    this.$cookies.put('pwdInfo', this.dto.password);
                    // 设置登录/非登录
                    this.dto.submitting = true;
                    // 画面跳转
                    this.$state.go('list');

                } else if (this.dto.username === 'SSJ9999' && this.dto.password === 'lzt') {

                    // 设置用户权限Flg
                    this.$rootScope.competence = this.COMPETENCE.NINE;
                    // 保存登录信息至cookies中
                    this.$cookies.put('userInfo', this.dto.username);
                    this.$cookies.put('pwdInfo', this.dto.password);
                    // 设置登录/非登录
                    this.dto.submitting = true;
                    // 画面跳转
                    this.$state.go('list');

                } else {
                    // 没有权限
                    alert('对不起，您没有操作系统的权限！');
                }

            }

        }
    }
}