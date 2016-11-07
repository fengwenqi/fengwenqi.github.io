/**
 * Created by Administrator on 2016/06/23.
 */
namespace app {
    'use strict';

    // 规定入力框入力内容为半角字符
    let HALFWORD_REGEXP = /^[\x00-\xff]*$/;
    app.angularModule.directive('halfWidth', function(){
        // Runs during compile
        return {
            require: 'ngModel',
            link: function($scope: angular.IScope, iElm: Element, iAttrs: angular.IAttributes, controller: angular.INgModelController) {
                controller.$parsers.unshift(function(viewValue: any) {
                    if (HALFWORD_REGEXP.test(viewValue)) {
                        controller.$setValidity('halfWidth', true);
                        return viewValue;
                    } else {
                        controller.$setValidity('halfWidth', false);
                        return undefined;
                    }
                });
            }
        };
    });

}