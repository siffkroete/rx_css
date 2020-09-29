var TestClass = /** @class */ (function () {
    function TestClass() {
        this.obj_name = {
            'NO_OBJ': 'NO_OBJ',
            'BALL': 'BALL',
            'P_L': 'P_L',
            'P_R': 'P_R'
        };
        this.irgendVar = 2.7;
    }
    TestClass.calculateArea = function (radius) {
        return this.pi * radius * radius;
    };
    TestClass.prototype.myFunc = function () {
        this.irgendVar += 1;
    };
    TestClass.pi = 3.14;
    return TestClass;
}());
