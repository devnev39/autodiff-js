class CompNode{
    constructor(var_name,operation,constant,obj){
        if(var_name && operation && constant && obj){
            throw new Error("Cannot set all init options at once !");
        }
        if(!var_name && !operation && constant==null && obj == null){
            throw new Error("Cannot init without one option !");
        }
        if(var_name){
            this.var_name = var_name;
            this.generation = 0;
        }
        if(obj){
            obj && Object.assign(this,obj);
        }
        if(operation){
            this.operation = operation;
            if(this.operation.n1 && this.operation.n2){
                if(this.operation.n1.generation != null && this.operation.n2.generation != null){
                    this.generation = this.operation.n1.generation > this.operation.n2.generation ? this.operation.n1.generation+1 : this.operation.n2.generation+1;
                }else
                if(this.operation.n1.generation != null){
                    this.generation = this.operation.n1.generation + 1;
                }else
                if(this.operation.n2.generation != null){
                    this.generation = this.operation.n2.generation + 1;
                }
            }else
            if(this.operation.n1){
                this.generation = this.operation.n1.generation + 1;
            }
        }
        if(constant!=null || constant != undefined){
            this.const = constant;
        }
    }

    evaluate(vars) {
        if(this.var_name){
            if(typeof vars == 'object'){
                return vars[this.var_name];
            }else{
                throw new Error("No variable dictionary found !");
            }
        }
        if(this.operation){
            return this.operation.evaluate(vars);
        }
        if(this.const!=null || this.const != undefined){
            return this.const;
        }
        throw new Error("No valid return value found !");
    }

    representation(){
        if(this.operation){
            return this.operation.representation();
        }
        if(this.const != null || this.const != undefined){
            return this.const.toString();
        }
        if(this.var_name){
            return this.var_name;
        }
        throw new Error("No valid representation found - CompNode !");
    }

    traceVars(lst){
        if(this.operation){
            if(this.operation.n1 && this.operation.n2){
                this.operation.n1.traceVars(lst);
                this.operation.n2.traceVars(lst);
            }else
            if(this.operation.n1){
                this.operation.n1.traceVars(lst);
            }
        }else
        if(this.var_name){
            if(lst.find(node => node.representation() == this.representation())){
                return lst;
            }else{
                lst.push(this);
            }
            return lst;
        }
        return lst;
    }

    getLst(lst){
        if(this.var_name!=null){
            if(lst[this.generation] == null){
                lst[this.generation] = [];
            }
            if(lst[this.generation].indexOf(this) != -1){
                return lst;
            }
            lst[this.generation].push(this);
            return lst;
        }else
        if(this.operation){
            if(lst[this.generation] == null){
                lst[this.generation] = [];
            }
            if(lst[this.generation].indexOf(this) != -1){
                return lst;
            }
            lst[this.generation].push(this);
            if(this.operation.n1 && this.operation.n2){
                this.operation.n1.getLst(lst);
                this.operation.n2.getLst(lst);
            }else
            if(this.operation.n1 && this.operation.n2 == null){
                this.operation.n1.getLst(lst);
            }
            return lst;
        }
        return lst;
    }

    getLen(){
        if(this.const != null){
            return 0;
        }else
        if(this.var_name != null){
            return 1;
        }else
        if(this.operation){
            let n1 = this.operation.n1.getLen();
            let n2 = this.operation.n1.getLen();
            return n1>n2 ? (n1+1) : (n2+1);
        }
    }

    drawNode(options,isGradNode){
        let content = this.name;
        let usePoints = "points";
        if(isGradNode){
            usePoints = "gdpoints";
        }
        if(options){
            if(options["selected"]){
                this.selected = true;
                this.color = options["color"];
            }else{
                if(this.selected){
                    drawCircle(this[usePoints].x,this[usePoints].y,GENCOLORS[this.color],content);
                }else{
                    drawCircle(this[usePoints].x,this[usePoints].y,GENCOLORS[options["color"]],content);    
                }
            }
        }else
        if(this.selected){
            drawCircle(this[usePoints].x,this[usePoints].y,GENCOLORS[this.color],content);
        }
        else{
            drawCircle(this[usePoints].x,this[usePoints].y,GENCOLORS[this.generation],content);
        }
        if(this.generation != 0){
            if(this.operation.n1 && this.operation.n2){
                if(this.operation.n1[usePoints]){
                    drawArrow(createVector(this.operation.n1[usePoints].x,this.operation.n1[usePoints].y),
                    createVector(this[usePoints].x-this.operation.n1[usePoints].x,this[usePoints].y-this.operation.n1[usePoints].y),"black");
                }
                if(this.operation.n2[usePoints]){
                    drawArrow(createVector(this.operation.n2[usePoints].x,this.operation.n2[usePoints].y),
                    createVector(this[usePoints].x-this.operation.n2[usePoints].x,this[usePoints].y-this.operation.n2[usePoints].y),"black");
                }
            }
            if(this.operation.n1[usePoints]){
                drawArrow(createVector(this.operation.n1[usePoints].x,this.operation.n1[usePoints].y),
                createVector(this[usePoints].x-this.operation.n1[usePoints].x,this[usePoints].y-this.operation.n1[usePoints].y),"black");
            }
        }
    }

    populateDiv(options){
        if(!options){
            throw new Error("No options received !");
        }
        for(let key of Object.keys(options)){
            switch (key) {
                case "name":
                    $(options[key]).attr("value",this.name);
                    break;
                
                case "gen":
                    $(options[key]).attr("value",this.generation);
                    break;
                
                case "rep":
                    $(options[key]).val(this.representation());
                    break;
                
                case "op":
                    let val = 0;
                    if(this.operation){
                        if(this.operation.n1 && this.operation.n2){
                            val = this.operation.n1.name + Rep[this.operation.op] + this.operation.n2.name;
                        }else
                        if(this.operation.n1){
                            val = Rep[this.operation.op]+"("+this.operation.n1.name+")";
                        }
                    }else{
                        val = "None";
                    }
                    $(options[key]).attr("value",val);
                    break;
            
                default:
                    throw new Error(`Cannot find proper setting option for key "${key}"`);
            }
        }
    }

    static VarNode(var_name){
        return new CompNode(var_name,null,null);
    }

    static OpNode(operation){
        return new CompNode(null,operation,null);
    }

    static ConstNode(constant){
        return new CompNode(null,null,constant);
    }

    static castNode(obj){
        return new CompNode(null,null,null,obj);
    }
}