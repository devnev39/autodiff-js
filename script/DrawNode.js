function drawNodes(nodeList){
    let noFocus = true;
    for(let node of nodeList){
        let usePoints = "points";
        if(node.gdpoints){
            usePoints = "gdpoints";
        }
        if(dist(node[usePoints].x,node[usePoints].y,mouseX,mouseY) <= NODE_RADI){
            if(showGradGraph){
                node.drawNode({color : 9},true);
            }else{
                node.drawNode({color : 9});
            }
            node.populateDiv({name : "#nodeName",gen : "#nodeGen",rep : "#nodeRep",op : "#nodeOp"});
            noFocus = false;
        }else{
            if(showGradGraph){
                node.drawNode(null,true);
            }else{
                node.drawNode();
            }
        }
    }
    if(SELECTED_NODE){
        if(noFocus){
            SELECTED_NODE.populateDiv({name : "#nodeName",gen : "#nodeGen",rep : "#nodeRep",op : "#nodeOp"});
        }
    }
}

function drawCircle(x,y,color,content){
    push();
    fill(color);
    circle(x,y,NODE_RADI*2);
    textSize(TEXT_SIZE);
    fill(0);
    text(content,x-(NODE_RADI*ALIGN_FRACTION),y);
    pop();
}

function checkClickState(nodes){
    if(nodes == null){
        throw new Error("nodes array null !");
    }
    for(let node of nodes){
        if(dist(node.points.x,node.points.y,mouseX,mouseY) <= NODE_RADI){
            if(SELECTED_NODE){
                if(SELECTED_NODE == node){
                    SELECTED_NODE.selected = false;
                    SELECTED_NODE = null;
                    node.drawNode({selected : false, color : 9});
                    $("#nodeEditOptions").attr("hidden",true);
                }else{
                    SELECTED_NODE.selected = false;
                    SELECTED_NODE = node;
                    node.drawNode({selected : true, color : 8});
                    $("#nodeEditOptions").attr("hidden",false);
                }
            }else{
                SELECTED_NODE = node;
                node.drawNode({selected : true, color : 8});
                $("#nodeEditOptions").attr("hidden",false);
            }
        }
    }
}

function mapGeneration(nodeList){
    let gen = {};
    for(let node of nodeList){
        if(gen[node.generation] == null){
            gen[node.generation] = [];
        }
        gen[node.generation].push(node);
    }
    createdGenerations = gen;
}

function mapNodes(generations,isGradGraph){
    let keys = Object.keys(generations);
    let widht = Math.round(CANVAS_WIDTH/(keys.length*2));
    let wind = 1;
    let nodes = [];
    for(let j=1;j<=keys.length;j++){
        if(j!=1){
            wind += 2;
        }
        let height = Math.round(CANVAS_HEIGHT/(generations[j-1].length*2));
        let hind = 1;
        for(let i=1;i<=generations[j-1].length;i++){
            if(i!=1){
                hind += 2;
            }
            if(isGradGraph){
                generations[j-1][i-1].gdpoints = {
                    x : widht*wind,
                    y : hind*height
                };    
                generations[j-1][i-1].gdname = `GEN${j} N${i}`;
            }else{
                generations[j-1][i-1].points = {
                    x : widht*wind,
                    y : hind*height
                };
                generations[j-1][i-1].name = `GEN${j} N${i}`;
            }
            nodes.push(generations[j-1][i-1]);
        }
    }
    if(isGradGraph){
        gradNodes = nodes;
    }else{
        createdNodes = nodes;
    }
}

function filterGradNodeGenerations(){
    let keys = Object.keys(gradNodesGenerations);
    for(let key of keys){
        for(let gnode of gradNodesGenerations[key]){
            for(let node of createdNodes){
                if(gnode == node){
                    gradNodesGenerations[key][gradNodesGenerations[key].indexOf(gnode)] = cloneNode(gnode);
                }
            }
        }
    }   
}

function cloneNode(node){
    let cpy = structuredClone(node);
    return CompNode.castNode(cpy);
}

function drawArrow(v1,v2,color){
    push();
    stroke("black");
    strokeWeight(3);
    fill(color);
    translate(v1.x,v1.y);
    line(NODE_RADI*Math.cos(v2.heading()),NODE_RADI*Math.sin(v2.heading()),v2.x-(NODE_RADI*Math.cos(v2.heading())),v2.y-(NODE_RADI*Math.sin(v2.heading())));
    rotate(v2.heading());
    let arrowSize = 5;
    translate(v2.mag()-arrowSize-NODE_RADI,0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}