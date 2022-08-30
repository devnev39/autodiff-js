class Grad{
    static SetGrad(options){
        Grad.partialDiff = options.partialDiff;
        Grad.tracks = options.tracks;
        if(!Grad.partialDiff){
            if(Grad.tracks.length>1){
                throw new Error("Cannot track more than one variable while partialDiff false !");
            }
        }
        Grad.Set = true;
    }
    static StepGrad(start,index){
        return PrimaryGrads[start.operation.op](start,index);
    }

    static GradWrtNode(start,relative){
        if(!Grad.Set){
            throw new Error("Grad options not set !");
        }
        if(start.const != undefined || start.const != null){
            return CompNode.ConstNode(0);
        }
        if(start == relative){
            return CompNode.ConstNode(1);
        }
        if(start.var_name){
            if(start == relative){
                return CompNode.ConstNode(1);
            }
            if(start != relative){
                if(Grad.partialDiff){
                    if(Grad.tracks.length >= 1){
                        return CompNode.VarNode(start.var_name+"'");
                    }else{
                        throw new Error("Cannot find tracks !");
                    }
                }else{
                    return CompNode.ConstNode(0);
                }
            }
        }
        if(start.operation){
            let n1g;
            let n2g;

            let step = Grad.StepGrad(start,0);
            let back = Grad.GradWrtNode(start.operation.n1,relative);
            if(step.const == 1){
                n1g = back;
            }else
            if(back.const == 1){
                n1g = step;
            }else{
                if(step.const == 0 || back.const == 0){
                    n1g = CompNode.ConstNode(0);
                }else{
                    n1g = CompNode.OpNode(Operations.PROD(step,back));
                }
            }
            // n1g = CompNode.OpNode(Operations.PROD(Grad.StepGrad(start,0),Grad.GradWrtNode(start.operation.n1,relative)));
            if(start.operation.n2){
                step = Grad.StepGrad(start,1);
                back = Grad.GradWrtNode(start.operation.n2,relative);
                if(step.const == 1){
                    n2g = back;
                }else
                if(back.const == 1){
                    n2g = step;
                }else{
                    if(step.const == 0 || back.const == 0){
                        n2g = CompNode.ConstNode(0);
                    }else{
                        n2g = CompNode.OpNode(Operations.PROD(step,back));
                    }
                }
                // n2g = CompNode.OpNode(Operations.PROD(Grad.StepGrad(start,1),Grad.GradWrtNode(start.operation.n2,relative)));
                if(n1g.const!=null || n2g.const != null){
                    if(n1g.const == 0){
                        return n2g;
                    }
                    if(n2g.const == 0){
                        return n1g;
                    }
                }
                return CompNode.OpNode(Operations.SUM(n1g,n2g));
            }
            return n1g;
        }
    }

    static nthGrad(start,relative,n){
        if(!n){
            n = 1;
        }
        let finalNode;
        for (let index = 0; index < n; index++) {
            if(!index){
                finalNode = Grad.GradWrtNode(start,relative);
                continue;
            }
            finalNode = Grad.GradWrtNode(finalNode,relative);
        }
        return finalNode;
    }
}