const CANVAS_HEIGHT = 700;
const CANVAS_WIDTH = 1000;
const TEXT_SIZE = 12;
const ALIGN_FRACTION = 0.8;
let SELECTED_NODE = null;

let showGradGraph = false;

const NODE_RADI = 30;

const GENCOLORS = ["#ffadad","#ffc2a9","#ffd6a5","#fdffb6","#caffbf","#b3fbdf","#aae0ef","#a0c4ff","#bdb2ff","#ffc6ff"];

let createdNodes = [];

let createdVars = [];

let createdGenerations = {};

let gradNodes = [];

let gradNodesGenerations = [];

document.querySelector(":root").style.setProperty("--height",`${CANVAS_HEIGHT+20}px`);
document.querySelector(":root").style.setProperty("--width",`${CANVAS_WIDTH}px`);

$("#newNodebtn").click((ev) => {
    $("#newNodeInput").attr("style","display:flex");
});

$("#closebtn").click((ev) => {
    $("#newNodeInput").attr("style","display:none");
});

$("#editNodebtn").click((ev) => {
    $("#editNodeDiv").attr("style","display:flex");
    if(SELECTED_NODE == null){
        throw Error("Node not selected !");
    }
    if(SELECTED_NODE.operation){
        let n1Name = "";
        let n2Name = "";
        if(SELECTED_NODE.operation.n1 && SELECTED_NODE.operation.n2){
            $("#editdopNode").click();
            // $("#editsopnode").prop("checked",true);
            if(SELECTED_NODE.operation.n1.const){
                n1Name = SELECTED_NODE.operation.n1.const;
                n2Name = SELECTED_NODE.operation.n2.name;
                $("#node1SelectEdit").prop("value","const");
                $("#node2SelectEdit").prop("value",n2Name);
            }else
            if(SELECTED_NODE.operation.n2.const){
                n2Name = SELECTED_NODE.operation.n2.const;
                n1Name = SELECTED_NODE.operation.n1.name;
                $("#node2SelectEdit").prop("value","const");
                $("#node1SelectEdit").prop("value",n1Name);
            }else{
                n1Name = SELECTED_NODE.operation.n1.name;
                n2Name = SELECTED_NODE.operation.n2.name;
                $("#node2SelectEdit").prop("value",n2Name);
                $("#node1SelectEdit").prop("value",n1Name);
            }
            $("#n1SelectValueEdit").prop("value",SELECTED_NODE.operation.n1.representation());
            $("#n2SelectValueEdit").prop("value",SELECTED_NODE.operation.n2.representation());
            $("#doubleValuedSelectEdit").prop("value",Rep[SELECTED_NODE.operation.op]);
        }else
        if(SELECTED_NODE.operation.n1){
            $("#editsopNode").click();
            $("#node1Select1Edit").prop("value",SELECTED_NODE.operation.n1.name);
            $("#singleValuedSelectEdit").prop("value",Rep[SELECTED_NODE.operation.op]);
        }
    }
});

$("#editNodeClosebtn").click((ev) => {
    $("#editNodeDiv").attr("style","display:none");
});

$("#nodeNos").click((ev) => {
    if($("#nodeNos").prop("checked")){
        $(".singleValuedOp").attr("hidden",false);
        $(".doubleValuedOp").attr("hidden",true);
    }else{
        $(".singleValuedOp").attr("hidden",true);
        $(".doubleValuedOp").attr("hidden",false);
    }
});

Array.from($("[name='nodeTypeInput']")).forEach(ele => {
    $("#"+ele.id).click((ev) => {
        if(ev.target.id == "varTypeInput"){
            $(".varInputDiv").attr("hidden",false);
            $(".opNodeInputDiv").attr("hidden",true);
        }
        if(ev.target.id == "opTypeInput"){
            $(".varInputDiv").attr("hidden",true);
            $(".opNodeInputDiv").attr("hidden",false);
        }
    });
});

Array.from($("[name='editnodeTypeInput']")).forEach(ele => {
    $("#"+ele.id).click((ev) => {
        if(ev.target.id == "editsopNode"){
            $(".singleValuedOpNodeEdit").attr("hidden",false);
            $(".doubleValuedOpNodeEdit").attr("hidden",true);
        }
        if(ev.target.id == "editdopNode"){
            $(".singleValuedOpNodeEdit").attr("hidden",true);
            $(".doubleValuedOpNodeEdit").attr("hidden",false);
        }
    });
});

$("#addNodebtn").click((ev) => {
    if($("#varTypeInput").prop("checked")){
        let node;
        let inp = $("#varInput").prop("value");
        if(inp.indexOf(",")!=-1){
            inp = inp.split(",");
            for(let i of inp){
                node = CompNode.VarNode(i);
                filterPush(node);
            }
        }else{
            if(inp.length == 1){
                node = CompNode.VarNode(inp);
                filterPush(node);
            }else{
                alert("Cannot set node with this input !");
            }
        }
    }
    if($("#opTypeInput").prop("checked")){
        let n1inp = $("#node1Select").prop("value");
        let n2inp = $("#node2Select").prop("value");
        let node;
        let op = $("#doubleValuedSelect").prop("value");
        op = Object.values(Operations)[Object.values(Rep).indexOf(op)];
        if($("#nodeNos").prop("checked")){
            n1inp = $("#node1Select1").prop("value");
            op = $("#singleValuedSelect").prop("value");
            op = Object.values(Operations)[Object.values(Rep).indexOf(op)];
            n1inp = createdNodes.find(ele => ele.name == n1inp);
            node = CompNode.OpNode(op(n1inp));
        }else
        if(n1inp == "const" && n2inp == "const"){
            alert("Cannot set with both nodes as const nodes !");
            return;
        }else
        if(n1inp == "const"){
            n1inp = +$("#n1SelectValue").prop("value");
            if(isNaN(n1inp)){
                alert("Cannot set const node with Nan value (node1)!");
                return;
            }
            n2inp = createdNodes.find(ele => ele.name == n2inp);
            if(n2inp == null){
                alert("Cannot find node with given name !");
                return;
            }
            node = CompNode.OpNode(op(n1inp,n2inp));
        }else
        if(n2inp == "const"){
            n2inp = +$("#n2SelectValue").prop("value");
            if(isNaN(n2inp)){
                alert("Cannot set const node with Nan value (node2)!");
                return;
            }
            n1inp = createdNodes.find(ele => ele.name == n1inp);
            if(n1inp == null){
                alert("Cannot find node with given name !");
                return;
            }
            node = CompNode.OpNode(op(n1inp,n2inp));
        }else{
            n1inp = createdNodes.find(ele => ele.name == n1inp);
            n2inp = createdNodes.find(ele => ele.name == n2inp);
            node = CompNode.OpNode(op(n1inp,n2inp));
        }
        if(node){
            filterPush(node);
        }
    }
    mapGeneration(createdNodes);
    filterCreatedNodes(mapNodes,createdGenerations)
    $("#closebtn").click();
    updateAllSelections();
});

Array.from($("[name='nodeSelect']")).forEach(ele => {
     $("#"+ele.id).on("change",(ev) =>{
        setSelectionValue(ele);
    });
});

let updateSelections = () => Array.from($("[name='nodeSelect']")).forEach(ele => {
    $("#"+ele.id).empty();
    createdNodes.forEach(node => {
        let opt = `<option value="${node.name}">${node.name}</option>`;
        $("#"+ele.id).append(opt);
    });
    $("#"+ele.id).append("<option value='const'>Constant</option>");
    setSelectionValue(ele);
});

let setSelectionValue = (ele) => {
    if(ele.id.indexOf("1")!=-1){
        Array.from($("[name='n1SelectValue']")).forEach(inp => {
            if($("#"+ele.id).prop("value") == "const"){
                $("#"+inp.id).val("");
                $("#"+inp.id).focus();
            }else{
                $("#"+inp.id).val(createdNodes.find(node => node.name == $("#"+ele.id).prop("value")).representation());
            }
        });
    }else
    if(ele.id.indexOf("2")!=-1){
        Array.from($("[name='n2SelectValue']")).forEach(inp => {
            if($("#"+ele.id).prop("value") == "const"){
                $("#"+inp.id).val("");
                $("#"+inp.id).focus();
            }else{
                $("#"+inp.id).val(createdNodes.find(node => node.name == $("#"+ele.id).prop("value")).representation());
            }
        });
    }
}

Object.keys(Rep).forEach(key => {
    let option = `<option value="${Rep[key]}">${Rep[key]}</option>}`;
    if(key > 5){
        Array.from($("[name='singleValuedSelect']")).forEach(ele => {
            $("#"+ele.id).append(option);
        });
    }else{
        Array.from($("[name='doubleValuedSelect']")).forEach(ele => {
            $("#"+ele.id).append(option);
        });
    }
});

$("#deleteNodebtn").click((ev) => {
    let dependentNodes = [];
    let maxGen = +Object.keys(createdGenerations).reverse()[0];
    dependentNodes.push(...getDependentNodes(SELECTED_NODE));
    for(let i=0;i<maxGen;i++){
        for(let node of dependentNodes){
            for(let dn of getDependentNodes(node)){
                if(dependentNodes.indexOf(dn) == -1){
                    dependentNodes.push(dn);
                }
            }
        }
    }
    let rep = confirm(`Deleting this node will delete ${dependentNodes.length} nodes. Continue ?`);
    if(rep){
        for(let node of dependentNodes){
            createdNodes.splice(createdNodes.indexOf(node),1);
        }
        updateAllSelections();
        SELECTED_NODE = null;
        mapGeneration(createdNodes);
        filterCreatedNodes(mapNodes,createdGenerations)
    }
});

$("#updateNodebtn").click((ev) => {
    if(SELECTED_NODE == null){
        alert("No node selected !");
        return;
    }
    if($("#editsopNode").prop("checked")){
        let n1name = $("#node1Select1Edit").prop("value");
        if(n1name == "const"){
            alert("Cannot set with only const value !");
            return;
        }
        n1name = createdNodes.find(node => node.name == n1name);
        if(n1name.generation > SELECTED_NODE.generation){
            alert("Cannot update with node in next generations !");
            return;
        }
        let op = $("#singleValuedSelectEdit").prop("value");
        op = Object.values(Operations)[Object.values(Rep).indexOf(op)];
        SELECTED_NODE.operation = op(n1name);
    }else
    if($("#editdopNode").prop("checked")){
        let n1name = $("#node1SelectEdit").prop("value");
        let n2name = $("#node2SelectEdit").prop("value");
        if(n1name == "const" && n2name == "const"){
            alert("Cannot set with both nodes as constant nodes !");
            return;
        }
        if(n1name == "const"){
            n1name = +$("#n1SelectValueEdit").prop("value");
            if(isNaN(n1name)){
                alert("Cannot set with Nan value !");
                return;
            }
            if(!n1name){
                alert("node 1 not set !");
            }
            n2name = createdNodes.find(node => node.name == n2name);
        }else
        if(n2name == "const"){
            n2name = +$("#n2SelectValueEdit").prop("value");
            if(isNaN(n2name)){
                alert("Cannot set with Nan value !");
                return;
            } 
            if(!n2name){
                alert("node 2 not set !");
            }
            n1name = createdNodes.find(node => node.name == n1name);
        }else{
            n1name = createdNodes.find(node => node.name == n1name);
            n2name = createdNodes.find(node => node.name == n2name);
        }

        if(n1name.generation > SELECTED_NODE.generation || n2name.generation > SELECTED_NODE.generation){
            alert("Cannot update with node greater than the current generation !");
            return;
        }
        let op = $("#doubleValuedSelectEdit").prop("value");
        op = Object.values(Operations)[Object.values(Rep).indexOf(op)];
        SELECTED_NODE.operation = op(n1name,n2name);
    }
    mapGeneration(createdNodes);
    filterCreatedNodes(mapNodes,createdGenerations)
    $("#editNodeClosebtn").click();
});

$("#evalNodebtn").click((ev) => {
    if(SELECTED_NODE == null){
        alert("No node selected !");
        return;
    }
    let tracks = SELECTED_NODE.traceVars([]);
    let opt = {};
    alert(`${tracks.length} tracks found !`);
    for(let track of tracks){
        let res = prompt(`Enter value for ${track.var_name} : `);
        if(isNaN(+res)){
            alert("Cannot take Nan as input value !");
            return;
        }
        if(res == null){
            alert("Cannot set null !");
            return;
        }
        opt[track.var_name] = +res;
    }
    let ans = SELECTED_NODE.evaluate(opt);
    $("#evalNodeValue").val(ans);
});

$("#partialDiffCheckbox").on("change",(ev) => {
    if(ev.target.checked){
        $("#nodeGradVarInput").prop("hidden",true);
    }else{
        $("#nodeGradVarInput").prop("hidden",false);
    }
});

$("#evaluateGradbtn").click((ev) => {
    if(!SELECTED_NODE){
        alert("No node selected !");
        return;
    }
    let partialDiff = $("#partialDiffCheckbox").prop("checked");
    let gradWrt = $("#gradWrtNodeSelect1").prop("value");
    let tracks = [];
    gradWrt = createdNodes.find(node => node.name == gradWrt);
    if(!gradWrt){
        alert("Cannot find or set node !");
        return;
    }
    if(gradWrt.generation > SELECTED_NODE.generation){
        alert("Cannot calculate grad with generation greater than selected node !");
        return;
    }
    if(partialDiff){
        tracks = SELECTED_NODE.traceVars([]);
    }
    if(!partialDiff){
        let var_node = $("#partialGradVarNodeSelect").prop("value");
        var_node = createdNodes.find(node => node.name == var_node);
        if(!var_node.var_name){
            alert("Varnode not found !");
            return;
        }
        tracks = [var_node];
    }
    Grad.SetGrad({
        partialDiff : partialDiff,
        tracks : tracks
    });
    let gradIndex = +$("#gradIndexInput").prop("value");
    if(!gradIndex){
        alert("Cannot set gradIndex !");
        return;
    }
    let grad = Grad.nthGrad(SELECTED_NODE,gradWrt,gradIndex);
    gradNodesGenerations = grad.getLst({});
    // filterGradNodeGenerations();
    mapNodes(gradNodesGenerations,true);
    if($("#nodeGradView").prop("checked")){
        showGradGraph = true;
    }else{
        showGradGraph = false;
    }
    $("#gradEvalValue").prop("value",grad.representation());
});

$("#nodeGradView").on("change",(ev) => {
    if($("#nodeGradView").prop("checked")){ 
        if(!showGradGraph){
            if(gradNodes.length == 0){
                alert("No grads calculated !");
                $("#nodeGradView").prop("checked",false);
                return;
            }else{
                showGradGraph = true;
            }
        }
    }else{
        if(showGradGraph){
            showGradGraph = false;
        }
    }
});

let updateAllSelections = () => {
    updateSelections();
    updateVarSelections();
}

let updateVarSelections = () => Array.from($("[name='varNodeSelect']")).forEach(ele => {
    $("#"+ele.id).empty();
    createdVars.forEach(va => {
        let opt = `<option value="${va.name}">${va.name}</option>`;
        $("#"+ele.id).append(opt);
    });
    $("#"+ele.id+"Value").val(createdVars.find(node => node.name == $("#"+ele.id).prop("value")).representation());
    $("#"+ele.id).on("change",(ev) => {
        $("#"+ev.target.id+"Value").val(createdVars.find(node => node.name == $("#"+ev.target.id).prop("value")).representation());
    });
});

let filterPush = (node) => {
    createdNodes.push(node);
    if(node.var_name != null){
        if(!createdVars.find(v => v.representation() == node.representation())){
            createdVars.push(node);
        }
    }
}

let filterCreatedNodes = (func,arg) => {
    func(arg);
    for(let node of createdNodes){
        if(node.var_name != null){
            if(!createdVars.find(v => v.representation() == node.representation())){
                createdVars.push(node);
            }
        }
    }
}

let getDependentNodes = (targetNode) => {
    let dependentNodes = [];
    for(let node of createdNodes){
        if(node.operation){
            if(node.operation.n1 && node.operation.n2){
                if(node.operation.n1 == targetNode){
                    dependentNodes.push(node);
                }
                if(node.operation.n2 == targetNode){
                    dependentNodes.push(node);
                }
            }else
            if(node.operation.n1){
                if(node.operation.n1 == targetNode){
                    dependentNodes.push(node);
                }
            }
        }
        if(node == targetNode){
            dependentNodes.push(node);
        }
    }
    return dependentNodes;
}

let x = CompNode.VarNode("x");
let y = CompNode.VarNode("y");

//EQ1
// let x2 = CompNode.OpNode(Operations.POW(x,2));
// let sin = CompNode.OpNode(Operations.SIN(x));
// let tan = CompNode.OpNode(Operations.TAN(x));
// let x3x2 = CompNode.OpNode(Operations.SUM(CompNode.OpNode(Operations.PROD(3,x)),x2));
// let sinx2 = CompNode.OpNode(Operations.PROD(x2,sin));
// let costanx = CompNode.OpNode(Operations.PROD(CompNode.OpNode(Operations.COS(x)),tan));
// let l21 = CompNode.OpNode(Operations.SUM(x3x2,sinx2));
// let l22 = CompNode.OpNode(Operations.PROD(sinx2,costanx));
// let f = CompNode.OpNode(Operations.SUM(l21,l22));

// EQ2
// let xy = CompNode.OpNode(Operations.PROD(x,y));
// let xxy = CompNode.OpNode(Operations.SUM(xy,x));
// let ans = xxy;

//EQ3
// let sin = CompNode.OpNode(Operations.SIN(x));
// sin = CompNode.OpNode(Operations.PROD(x,sin));
// let cos = CompNode.OpNode(Operations.PROD(x,CompNode.OpNode(Operations.COS(x))));
// sin = CompNode.OpNode(Operations.SUM(sin,cos));
// let x4 = CompNode.OpNode(Operations.SUM(x,3));

// let s = "x^2"

let sin = CompNode.OpNode(Operations.SIN(x));

Grad.SetGrad({
    partialDiff : true,
    tracks : sin.traceVars([])
});

ans = Grad.nthGrad(sin,sin,1);
// ans = Grad.nthGrad(ans,x,1);


// createdGenerations = ans.getLst({});
// filterCreatedNodes(mapNodes,createdGenerations);
// updateAllSelections();

function setup(){
    let canvas = createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);
    canvas.parent("canvasContainer");
}

function draw(){
    background("#e9ecef");
    if(showGradGraph){
        drawNodes(gradNodes);
    }else{
        drawNodes(createdNodes);
    }
    
}

function mouseClicked(){
    if(showGradGraph){
        checkClickState(gradNodes);
    }else{
        checkClickState(createdNodes);
    }
    
}