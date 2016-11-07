/**
 * Created by Administrator on 2016/06/21.
 */
namespace app{
    'use strict';

    export interface Staff {
        // 工号
        id: string;
        // 姓名
        name: string;
        // 性别
        sex: string;
        // 性别Name
        sexNm?: string;
        // 年龄
        age: number;
        // 工作经验
        workAge: number;
        // 电话
        tel: string;
        // 邮件地址
        eMail: string;
        // 级别
        level: string;
        // 级别Name
        levelNm?: string;
        // 职能
        role: string;
        // 工作地点
        workPlace: string;
        // 资产编号
        assetNum: string;
        // 目前项目
        curProject: string;
        // 项目期间
        curProjectWorkTime: string;
        // 擅长语言
        language: string;
        // 擅长语言 Name
        languageNm?: string;
        // 语言级别
        languageLevel: string;
        // 擅长技术
        tecknology: string;
        // 在职FLG
        workFlag: string;
        // 在职FLG Name
        workFlagNm?: string;
    }
}