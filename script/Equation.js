function convertToCompNodes(equation){
    if(equation==null){
        throw new Error("equation string null !");
    }
    let reps = Object.values(Rep);
    let keys = Object.keys(Ops);
    let tracks = [];
    let nodes = [];
    let prevOp = 0;
    for(let literal of equation){
        if(reps.indexOf(literal)!=-1){
            if(nodes.length == 2){
                let node = CompNode.OpNode(Operations[keys.indexOf(reps.indexOf(literal))](
                    nodes[0],nodes[1]
                ));
                nodes = [node];
            }else{
                prevOp = keys[reps.indexOf(literal)];
            }
        }else
        if(literal != " "){
            if(isNaN(+literal)){
                let node = CompNode.VarNode(literal);
                tracks.push(node);
                if(nodes.length == 1){
                    if(prevOp != 0){
                        node = CompNode.OpNode(Operations[prevOp](nodes[0],node));
                        nodes = [node];
                    }
                }
            }else{
                let node = CompNode.ConstNode(+literal);
                if(keys.indexOf(prevOp) > 4){
                    node = CompNode.OpNode(Operations[prevOp](node));
                    nodes = [node];
                    continue;
                }else
                if(prevOp == 0){
                    nodes.push(CompNode.ConstNode(+literal));
                }
                else{
                    node = CompNode.OpNode(Operations[prevOp](nodes[0],node));
                    nodes = [node];
                }
            }
        }
    }
    return [nodes,tracks];
}