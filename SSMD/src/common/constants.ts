/**
 * Created by Administrator on 2016/06/23.
 */

namespace app {
    'use strict';


    enum BUSINESS{
        BS_ADD = 1,
        BS_UPDATE = 2
    }

    export interface ICode {
        id: string;
        value: string;
    }

    export let LEVEL: Array<ICode> = [
        {id: '0', value: ''},
        {id: '1', value: 'PM'},
        {id: '2', value: 'PL'},
        {id: '3', value: '技术SE'},
        {id: '4', value: '业务SE'},
        {id: '5', value: 'PG'}
    ];

    export let SEX: Array<ICode> = [
        {id: '0', value: '全部'},
        {id: '1', value: '男'},
        {id: '2', value: '女'}
    ];

    export let WORK_FLAG: Array<ICode> = [
        {id: '0', value: '×'},
        {id: '1', value: '○'}
    ];

    export let LANGUAGE: Array<ICode> = [
        {id: '1', value: '日语'},
        {id: '2', value: '英语'},
    ];

    export let AUTHORITY: Array<ICode> = [
        {id: '0', value: '普通用户'},
        {id: '9', value: '管理者'}
    ];

    angularModule.constant('COMPETENCE', {
        'ZERO': '0',
        'NINE': '9'
    });

    export let getLevelValue = function(id: string): string {
        return getValue(LEVEL, id);
    };

    export let getSexValue = function(id: string): string {
        return getValue(SEX, id);
    };

    export let getWorkFlagValue = function(id: string): string {
        return getValue(WORK_FLAG, id);
    };

    export let getLanguageValue = function(id: string): string {
        let lanNmStr: string = "";
        if(id && typeof id == "string"){
            let lanArr = id.split(",");
            if(lanArr && lanArr instanceof Array) {
                lanArr.forEach(function(item: string, index: number) {
                    lanNmStr += (getValue(LANGUAGE, item) + ", ");
                })
                if(lanNmStr.length > 0) {
                    lanNmStr = lanNmStr.slice(0, lanNmStr.length-2);
                }
            }
        }

        return lanNmStr;
    };

    export let getValue = function (obj:Array<ICode>, id:string):string {
        if (obj && obj instanceof Array) {
            for(let i = 0; i < obj.length; ++i){
                if(obj[i].id === id){
                    return obj[i].value;
                }
            }
        }
        return undefined;
    };
}
