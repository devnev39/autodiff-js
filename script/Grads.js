const PrimaryGrads = {
    1 : (node,index) => {
        return CompNode.ConstNode(1);
    },
    2 : (node,index) => {
        if(!index){
            return CompNode.ConstNode(1);
        }else{
            return CompNode.ConstNode(-1);
        }
    },
    3 : (node,index) => {
        if(node.operation.n1.const!=null){
            return node.operation.n1;
        }
        if(node.operation.n2.const!=null){
            return node.operation.n2;
        }
        if(node.operation.n1.var_name && node.operation.n2.var_name){
            if(!index){
                return node.operation.n2;
            }else{
                return node.operation.n1;
            }
        }
        if(!index){
            return node.operation.n2;
        }else{
            return node.operation.n1;
        }
    },
    4 : (node,index) => {
        if(node.operation.n1.const!=null){
            return new CompNode(null,new Operation(new CompNode(null,new Operation(node.operation.n1,null,-1,Ops.PROD)),
            new CompNode(null,new Operation(node.operation.n2,null,2,Ops.POW)),null,Ops.DIV));
        }
        if(node.operation.n2.const!=null){
            return CompNode.OpNode(Operations.DIV(CompNode.ConstNode(1),node.operation.n2));
        }
    },
    5 : (node,index) => {
        if(node.operation.n1.const!=null){
            return CompNode.OpNode(Operations.PROD(node,CompNode.OpNode(Operations.LOG(node.operation.n2))));
        }
        if(node.operation.n2.const!=null){
            return CompNode.OpNode(Operations.PROD(node.operation.n2,CompNode.OpNode(Operations.POW(node.operation.n1,node.operation.n2.const-1))));
        }
    },
    6 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.COS(node.operation.n1));
        }
    },
    7 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.PROD(-1,CompNode.OpNode(Operations.SIN(node.operation.n1))));
        }
    },
    8 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.DIV(1,CompNode.OpNode(Operations.POW(CompNode.OpNode(Operations.COS(node.operation.n1)),2))));
        }
    },
    9 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.DIV(1,CompNode.OpNode(Operations.POW(CompNode.OpNode(Operations.SUB(1,Operations.POW(node.operation.n1,2),0.5))))));
        }
    },
    10 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.DIV(-1,CompNode.OpNode(Operations.POW(CompNode.OpNode(Operations.SUB(1,Operations.POW(node.operation.n1,2),0.5))))));
        }
    },
    11 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.DIV(1,CompNode.OpNode(Operations.SUM(1,CompNode.OpNode(Operations.POW(node.operation.n1,2))))));
        }
    },
    12 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.COSH(node.operation.n1));
        }
    },
    13 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.SINH(node.operation.n1));
        }
    },
    14 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.DIV(1,CompNode.OpNode(Operations.POW(CompNode.OpNode(Operations.COSH(node.operation.n1)),2))));
        }
    },
    15 : (node,index) => {
        if(node.operation.n1){
            return CompNode.OpNode(Operations.DIV(1,node.operation.n1));
        }
    }
}