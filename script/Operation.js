class Operation{
    constructor(n1,n2,op){
        if(n1!=null && n2!=null){
            if(typeof n1 == 'number'){
                this.n1 = CompNode.ConstNode(n1);
            }else{
                this.n1 = n1;
            }
            if(typeof n2 == 'number'){
                this.n2 = CompNode.ConstNode(n2);
            }else{
                this.n2 = n2;
            }
            if(this.n1.operation){
                this.n1.othernode = n2;
            }else
            if(this.n2.operation){
                this.n2.othernode = n1;
            }
            this.op = op;
            this.combinedNode = 1;
            return;
        }
        if(n1!=null){
            if(op > 5){
                if(typeof n1 == 'number'){
                    this.n1 = CompNode.ConstNode(n1);
                }else{
                    this.n1 = n1;
                }
                this.op = op;
                this.combinedNode = -1;
                return;
            }
            throw new Error(`Cannot create operation using ${Rep[op]} with single operand !`);
        }
        throw new Error("Cannot find proper setting operation !");
    }

    // Combination Node 1  -> Both are nodes
    // Combination Node -1 -> Single valued 
    evaluate(vars){
        let n1eval;
        let n2eval;
        if(this.combinedNode==1){
            n1eval = this.n1.evaluate(vars);
            n2eval = this.n2.evaluate(vars);
        }
        if(this.combinedNode == -1){
            n1eval = this.n1.evaluate(vars);
            n2eval = 0;
        }
        return Binder[this.op](n1eval,n2eval);
    }

    check(){
        if(Rep[this.op] == "*"){
            if(this.n2.const == 0 || this.n1.const == 0){
                return true;
            }
        }
        return false;
    }

    representation(){
        if(this.combinedNode == 1){
            let n1rep = this.n1.representation();
            let n2rep = this.n2.representation();
            if(this.check()){
                return "";
            }else{
                if(n1rep == ""){
                    return n2rep;
                }else
                if(n2rep == ""){
                    return n1rep;
                }else{
                    return "["+n1rep+Rep[this.op]+n2rep+"]";
                }
            }
        }
        if(this.combinedNode == -1){
            if(Rep[this.op] == "*"){
                if(this.n2.const == 0){
                    return;
                }
            }
            if(this.check()){
                return "";
            }else{
                return Rep[this.op]+"("+this.n1.representation()+")";
            }
        }
        throw new Error("No valid representation found - Operations !");
    }
}