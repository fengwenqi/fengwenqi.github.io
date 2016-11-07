/**
 * Created by xuweiyu on 2016/06/23.
 */
namespace app {
    'usr strict'

    angular.module('list.filter', [])
        .filter('retrieveInfo', () => {
        return function(inputArray: any, aimsArray: any){
            let array: any = [];
            // 将比较一致的数据存入从0开始的下标中
            let basis: number = 0;
            let filterArray: any = [];
            filterArray.push(aimsArray);

            console.log(filterArray[0].id);
            console.log(filterArray[0].name);
            console.log(filterArray[0].level);
            console.log(filterArray[0].sex);

            for (let k = 0; k < filterArray.length; k++) {
                if((filterArray[k].id === undefined || filterArray[k].id === '' || filterArray[k].id === null) &&
                    (filterArray[k].name === undefined || filterArray[k].name === '' || filterArray[k].name === null) &&
                    (filterArray[k].level === '0' || filterArray[k].level === '' || filterArray[k].level === null) &&
                    (filterArray[k].sex === '0' || filterArray[k].sex === '' || filterArray[k].sex === null)){

                    return inputArray;
                } else {
                    if (filterArray[k].id) {
                        basis = 0;
                        for(let i = 0; i < inputArray.length;){
                            if(filterArray[k].id == inputArray[i].id){
                                array[basis] = inputArray[i];
                                basis++;
                                i++;
                            } else {
                                inputArray.splice(i, 1);
                            }
                        }
                        inputArray = array;
                    }
                    if (filterArray[k].name) {
                        basis = 0;
                        for(let i = 0; i < inputArray.length;){
                            if(filterArray[k].name == inputArray[i].name){
                                array[basis] = inputArray[i];
                                basis++;
                                i++;
                            } else {
                                inputArray.splice(i, 1);
                            }
                        }
                        inputArray = array;
                    }
                    if (!(filterArray[k].level === '0') &&
                            filterArray[k].level !== "" &&
                            filterArray[k].level !== undefined) {
                        basis = 0;
                        for(let i = 0; i < inputArray.length;){
                            if(filterArray[k].level == inputArray[i].level){
                                array[basis] = inputArray[i];
                                basis++;
                                i++;
                            } else {
                                inputArray.splice(i, 1);
                            }
                        }
                        inputArray = array;
                    }
                    if (!(filterArray[k].sex === '0')&&
                        filterArray[k].sex !== "" &&
                        filterArray[k].sex !== undefined) {
                        basis = 0;
                        for(let i = 0; i < inputArray.length;){
                            if(filterArray[k].sex == inputArray[i].sex){
                                array[basis] = inputArray[i];
                                basis++;
                                i++;
                            } else {
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
}