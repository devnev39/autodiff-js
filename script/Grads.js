const PrimaryGrads = {
    1 : (node,index) => {
        return CompNode.ConstNode(1);
    },
    2 : (node,index) => {
        return !index ? CompNode.ConstNode(1) : CompNode.ConstNode(-1);
    },
    3 : (node,index) => {
        if(node.operation.n1.const!=null){
            return node.operation.n1;
        }
        if(node.operation.n2.const!=null){
            return node.operation.n2;
        }
        return !index ? node.operation.n2 : node.operation.n1;
    },
    4 : (node,index) => {
        if(node.operation.n1.const!=null){
            return CompNode.OpNode(Operations.PROD(-1*node.operation.n1.const,CompNode.OpNode(Operations.POW(node.operation.n2,-2))));
        }
        if(node.operation.n2.const!=null){
            return CompNode.OpNode(Operations.DIV(CompNode.ConstNode(1),node.operation.n2));
        }
        return !index ? CompNode.OpNode(Operations.DIV(1,node.operation.n2)) : CompNode.OpNode(Operations.PROD(node.operation.n1,
        CompNode.OpNode(Operations.PROD(-1,CompNode.OpNode(Operations.POW(node.operation.n2,-2))))));
    },
    5 : (node,index) => {
        if(node.operation.n1.const!=null){
            return CompNode.OpNode(Operations.PROD(node,CompNode.OpNode(Operations.LOG(node.operation.n2))));
        }
        if(node.operation.n2.const!=null){
            return CompNode.OpNode(Operations.PROD(node.operation.n2,CompNode.OpNode(Operations.POW(node.operation.n1,node.operation.n2.const-1))));
        }
        if(index) return CompNode.OpNode(Operations.PROD(node,CompNode.OpNode(Operations.SUM(CompNode.OpNode(Operations.DIV(node.operation.n2,node.operation.n1),CompNode.OpNode(Operations.PROD(CompNode.OpNode(Operations.LOG(node.operation.n1)),Grad.GradWrtNode(node.operation.n2,node.operation.n1))))))));
        return CompNode.OpNode(Operations.PROD(node,CompNode.OpNode(Operations.SUM(CompNode.OpNode(Operations.LOG(node.operation.n1)),CompNode.OpNode(Operations.PROD(CompNode.OpNode(Operations.DIV(node.operation.n2,node.operation.n1)),Grad.GradWrtNode(node.operation.n1,node.operation.n2)))))));
    },
    6 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.COS(node.operation.n1)) : null;
    },
    7 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.PROD(-1,CompNode.OpNode(Operations.SIN(node.operation.n1)))) : null;
    },
    8 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.DIV(1,CompNode.OpNode(Operations.POW(CompNode.OpNode(Operations.COS(node.operation.n1)),2)))) : null;
    },
    9 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.DIV(1,CompNode.OpNode(Operations.POW(CompNode.OpNode(Operations.SUB(1,CompNode.OpNode(Operations.POW(node.operation.n1,2)))),0.5)))) : null;
    },
    10 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.DIV(-1,CompNode.OpNode(Operations.POW(CompNode.OpNode(Operations.SUB(1,CompNode.OpNode(Operations.POW(node.operation.n1,2)))),0.5)))) : null;
    },
    11 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.DIV(1,CompNode.OpNode(Operations.SUM(1,CompNode.OpNode(Operations.POW(node.operation.n1,2)))))) : null;
    },
    12 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.COSH(node.operation.n1)) : null;
    },
    13 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.SINH(node.operation.n1)) : null;
    },
    14 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.DIV(1,CompNode.OpNode(Operations.POW(CompNode.OpNode(Operations.COSH(node.operation.n1)),2)))) : null;
    },
    15 : (node,index) => {
        return node.operation.n1 ? CompNode.OpNode(Operations.DIV(1,node.operation.n1)) : null;
    }
}