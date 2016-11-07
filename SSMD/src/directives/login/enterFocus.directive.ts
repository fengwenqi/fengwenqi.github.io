/**
 * Created by xuweiyu on 2016/07/01.
 */
namespace app {
    app.angularModule.directive('enterFocus', function () {
        return {
            link: function (scope: any, element: any, attr: any) {
                element.bind('keydown', function (event: any) {
                    // 调用函数时，函数本身会生成 this 和 arguments
                    // 用 this 和 arguments 分别找到 field 和触发的事件
                    // let e = arguments[1];

                    return is_down(event) === undefined ? true : handle_element(this, is_down(event));
                })
            }
        }
    })

    function handle_element (field : any, is_down : any) {
        let elements = field.form.elements;
        for (var i = 0, len = elements.length - 1; i < len; i++) {
            if (field === elements[i]) {
                break;
            }
        }

        i = is_down ? (i + 1) % len : (i - 1) % len;

        //(0===i && is_down) --> 最后一个文本框获得焦点后按向下的键
        //(-1===i && !is_down) --> 第一个文本框获得焦点后按向上的键
        if((0 === i && is_down)||(-1 === i && !is_down)){
             return true;
         }

        elements[i].focus();
        var element_arr = ['button', 'submit', 'reset', 'select-one', 'textarea'];
        if (element_arr.join(',').indexOf(elements[i].type) > -1) {
            elements[i].select();
        }
        return false;
    }

    function is_down (e: any): boolean {
        let isDown:boolean;
        e = e || window.event;

        switch (e.keyCode) {
            case 13:  //回车键
            case 39:  //向右移动键
            case 40:  //向下移动键
                isDown = true;
                break;
            case 37:  //向左移动键
            case 38:  //向上移动键
            isDown = false;
                break;
        }
        return isDown;
    }
}
