/**
 * Created by xuweiyu on 2016/07/01.
 */

// 设置焦点指令
app.angularModule.directive('setFocus', function(){
    return function(scope: any, element: any){
        element[0].focus();
    };
})