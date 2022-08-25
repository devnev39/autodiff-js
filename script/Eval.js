const Ops = {
    SUM : 1,
    SUB : 2,
    PROD : 3,
    DIV : 4,
    POW : 5,
    SIN : 6,
    COS : 7,
    TAN : 8,
    ASIN : 9,
    ACOS : 10,
    ATAN : 11,
    SINH : 12,
    COSH : 13,
    TANH : 14,
    LOG : 15
}

const Operations = {
    SUM : (n1,n2) => {
        return new Operation(n1,n2,Ops.SUM);
    },
    SUB : (n1,n2) => {
        return new Operation(n1,n2,Ops.SUB);
    },
    PROD : (n1,n2) => {
        return new Operation(n1,n2,Ops.PROD);
    },
    DIV : (n1,n2) => {
        return new Operation(n1,n2,Ops.DIV);
    },
    POW : (n1,n2) => {
        return new Operation(n1,n2,Ops.POW);
    },
    SIN : (n1,n2) => {
        return new Operation(n1,n2,Ops.SIN);
    },
    COS : (n1,n2) => {
        return new Operation(n1,n2,Ops.COS);
    },
    TAN : (n1,n2) => {
        return new Operation(n1,n2,Ops.TAN);
    },
    ASIN : (n1,n2) => {
        return new Operation(n1,n2,Ops.ASIN);
    },
    ACOS : (n1,n2) => {
        return new Operation(n1,n2,Ops.ACOS);
    },
    ATAN : (n1,n2) => {
        return new Operation(n1,n2,Ops.ATAN);
    },
    SINH : (n1,n2) => {
        return new Operation(n1,n2,Ops.SINH);
    },
    COSH : (n1,n2) => {
        return new Operation(n1,n2,Ops.COSH);
    },
    TANH : (n1,n2) => {
        return new Operation(n1,n2,Ops.TANH);
    },
    LOG : (n1,n2) => {
        return new Operation(n1,n2,Ops.LOG);
    }
}

const Binder = {
    1 : (val1,val2) => {
        return val1 + val2;
    },
    2 : (val1,val2) => {
        return val1 - val2;
    },
    3 : (val1,val2) => {
        return val1 * val2;
    },
    4 : (val1,val2) => {
        return val1 / val2;
    },
    5 : (val1,val2) => {
        return Math.pow(val1,val2);
    },
    6 : (val1,val2) => {
        return Math.sin(val1);
    },
    7 : (val1,val2) => {
        return Math.cos(val1);
    },
    8 : (val1,val2) => {
        return Math.tan(val1);
    },
    9 : (val1,val2) => {
        return Math.asin(val1);
    },
    10 : (val1,val2) => {
        return Math.acos(val1);
    },
    11 : (val1,val2) => {
        return Math.atan(val1);
    },
    12 : (val1,val2) => {
        return Math.sinh(val1);
    },
    13 : (val1,val2) => {
        return Math.cosh(val1);
    },
    14 : (val1,val2) => {
        return Math.tanh(val1);
    },
    15 : (val1,val2) => {
        return Math.log(val1);
    }
}

const Rep = {
    1 : "+",
    2 : "-",
    3 : "*",
    4 : "/",
    5 : "^",
    6 : "SIN",
    7 : "COS",
    8 : "TAN",
    9 : "ASIN",
    10 : "ACOS",
    11 : "ATAN",
    12 : "SINH",
    13 : "COSH",
    14 : "TANH",
    15 : "LOG"
};