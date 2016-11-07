/**
 * Created by Administrator on 2016/06/20.
 * 职员信息变更Controller
 */

namespace app {
    'use strict'

    interface pageStatus {
        // 变更/追加Flg(true: 变更画面, false:追加画面)
        pageStatus: string;
    }

    interface Language {
        jp: boolean;
        en: boolean;
    }

    export class StaffModifyController {

        dto: Staff = {
            // 工号
            id: '',
            // 姓名
            name: '',
            // 性别
            sex: '1',
            // 性别Name
            sexNm: '',
            // 年龄
            age: null,
            // 工作经验
            workAge: 0,
            // 电话
            tel: '',
            // 邮件地址
            eMail: '',
            // 级别
            level: null,
            // 级别Name
            levelNm: '',
            // 职能
            role: '',
            // 工作地点
            workPlace: '',
            // 资产编号
            assetNum: '',
            // 目前项目
            curProject: '',
            // 项目期间
            curProjectWorkTime: '',
            // 擅长语言
            language: '',
            // 语言级别
            languageLevel: '',
            // 擅长技术
            tecknology: '',
            // 在职FLG
            workFlag: '1'
        };

        private language: Language = {
            jp: false,
            en: false
        };

        ps: pageStatus= {
            // 变更/追加Flg(true: 变更画面, false:追加画面)
            pageStatus: ''
        };

        private levelList:Array<ICode> = LEVEL;
        private staff: Staff = undefined;
        private staffs: Array<Staff> = [];

        constructor( private $filter: any,
                     private $stateParams: any,
                     private $cookies: any,
                     private staffShareService: StaffShareService,
                     private $state: angular.ui.IStateService){
            this.init();
        }

        // 初始化
        init(): void {
            // 画面迁移状态( 1:追加,2:变更 )
            this.ps.pageStatus = this.$cookies.get('pageStatus');
            if (this.ps.pageStatus === '2') {
                this.staff = JSON.parse(this.$stateParams.param);
                this.dto = this.staff;
                // Parse the staff language.
                this.parseLanguage(this.dto.language);
            }
        }

        // 保存数据
        save(): void {
            // Set the staff language.
            this.dto.language = this.getLanguage(this.language);

            if (this.ps.pageStatus === '1') {
                // 创建保存事件
                window.localStorage['addStaff'] = JSON.stringify(this.dto);
                window.dispatchEvent(new Event('SAVE-STAFF'));

            } else if (this.ps.pageStatus === '2') {
                // 创建变更事件
                window.localStorage['updateStaff'] = JSON.stringify(this.dto);
                window.dispatchEvent(new Event('UPDATE-STAFF'));
            }
            window.close();
        }

        /**
         * Convert the Language object to string.
         *
         * @param language
         * @returns {string}
         */
        private getLanguage(language: Language): string {
            let strLanguage: string = undefined;
            if(language) {
                if(language.jp) {
                    strLanguage = "1";
                }

                if(language.en){
                    if(strLanguage && strLanguage.length > 0){
                        strLanguage += ",2";
                    }else{
                        strLanguage = "2";
                    }
                }
            }

            return strLanguage;
        }

        /**
         * Parse the language string to object.
         *
         * @param strLanguage
         */
        private parseLanguage(strLanguage: string) {
            if(strLanguage && strLanguage.length >0) {
                let languageArr = strLanguage.split(',');
                if(languageArr && strLanguage.length > 0){
                    if(languageArr[0] === '1') {
                        this.language.jp = true;
                    }else if(languageArr[0] === '2'){
                        this.language.en = true;
                    }

                    if(languageArr[1] === '2') {
                        this.language.en = true;
                    }
                }
            }
        }

        // 返回
        close(): void {
            window.close();
            this.$state.go('list',{ params: ''});
        }
    }
}
