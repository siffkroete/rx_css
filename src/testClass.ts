class TestClass {
    readonly obj_name = {
        'NO_OBJ': 'NO_OBJ',
        'BALL': 'BALL',
        'P_L': 'P_L',
        'P_R': 'P_R'
    }

    static pi: number = 3.14;

    static calculateArea(radius:number) {
        return this.pi * radius * radius;
    }

    irgendVar: number;

    constructor() {
        this.irgendVar = 2.7;
    }

    myFunc() {
        this.irgendVar += 1;
    }
}