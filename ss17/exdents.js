"use strict";
//  extends trong generic
// function merge(gộp,hợp nhất)
function merge(obj1, obj2) {
    return Object.assign(obj1, obj2);
}
let test3 = merge({ name: "hoa", age: 19 }, { name: "hong", age: 20 });
console.log(test3);
function add(a, b) {
    return b ? a + b : a;
}
let add1 = add(4, 5);
let add2 = add(1);
console.log(add1);
console.log(add2);
let obj = {
    name: "hoa"
};
let obj2 = {
    name: "hong"
};
/*
    type và interface khác nhau như nào
    interface không dùng được
    có thể kế thừa các interface khác nhau
    có thể dược inplement(triển khai) bởi class
    thường khai báo các thuộc tính và phương thức
*/
class Person1 {
    constructor(name) {
        this.name = name;
    }
}
function test4(param) {
    return Object.assign(Object.assign({}, param), { fullname: param.firstName + param.lastName });
}
let demo = test4({ firstName: "minh", lastName: "thu" });
console.log(demo);
/*
    chuyển sang dạng generic
    dệ quy || callback
    đệ quy là hàm gọi chính là nó
    lưu ý khi dùng đệ quy nên trnasg việc hàm chạy không có điểm dừng
    --> chạy vô tận
    dùng đệ quy tính tổng từ 1 đến 10
*/
function dequy(a) {
    if (a === 1)
        return 1;
    // a là 1 tham số nhận số nguyên
    // nếu a = 1 thì trả về 1 
    // còn a là 1 số khác 1 thì lấy số a đó cộng đệ quy của số đó giảm 1 đơn vị cho đến khi a = 1
    return a + dequy(--a);
}
let demo1 = dequy(10);
console.log(demo1);
/*
    dùng đệ quy để giải quyết bài toán
    input:[[1,2],[3,[4,[5]]]]
    output:[1,2,3,4,5]
    ==> đệ quy giải quyết bài toán
    decorator:trang trí
*/
function dequy2(arr) {
    const result = [];
    arr.forEach(item => {
        if (Array.isArray(item)) {
            result.push(...dequy2(item));
        }
        else {
            result.push(item);
        }
    });
    return result;
}
const arr = [[1, 2], [3, [4, 5]]];
const arr1 = dequy2(arr);
console.log(arr1);
