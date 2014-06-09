"use strict";

var fs = require('fs');
var readline = require('readline');

// Need to convert this to STDIN
// Read data from STDIN
//  STDIN must be comma separated data with the following columns:
//  userid,parentid,childid,childname,idirectory
var lines = fs.readFileSync('./examples/hierarchy6.csv').toString().split("\n");


//makes an adjency list from lines in file
//Adjency list examples can be found at: 
//
//http://www.geeksforgeeks.org/graph-and-its-representations/
//http://d2o58evtke57tz.cloudfront.net/wp-content/uploads/adjacency_list_representation.png
function makeAdjList(lines) {
 var adjList    = {};
 var line;
 
 //define the nodes as attributes 
 //(this will act as our dictionary 
 for(var i in lines) {
   line = lines[i];
   
   var line_split  = line.split(",");
   var userid      = line_split[0];
   var parentId    = line_split[1];
   var childId     = line_split[2];
   var childName   = line_split[3];
   var isDirectory = line_split[4];
   
   adjList[childName] = {
       children : {},
       name     : childName,
       parentId : parentId
   };
 }
 
 //In this loop we'll connect the child nodes with their 
 //respectful parent nodes.
 for(i in lines) {  
   var line = lines[i];
   
   var line_split  = line.split(",");
   var userid      = line_split[0];
   var parentId    = line_split[1];
   var currId      = line_split[2];
   var currName    = line_split[3];
   var isDirectory = line_split[4];

   //check to make sure the parent exists in the adjList,
   //if so then add it to the parents list of children
   if (adjList[parentId] && parentId != currId) {
     var parentNode = adjList[parentId];
     var currNode   = adjList[currId]; 
     
     parentNode.children[currId] = currNode;
   }
 }
 
 return adjList;
}

//Returns a subtree of the adjency list
function getSubTree(adjList, nodeId) {
 var root    = adjList[nodeId];
 var stack   = [root];  //the main stack for our breadth first traversal
 
 var sisterNode  = {};  
 var sisterStack = [sisterNode];  //the sister stack that will mirror the main stack
 
 var currNode   = null;
 var sisterRoot = sisterNode;  //keep a reference to the root node
                               //becuase otherwise it will get lost
                               //in the recursive algortithm (the BFT)
 
 //sisterNode.type = "file";  //everyhting is a file by default
 
 //Using a breadth first traversal
 while(stack.length) { //stack is not empty
   //pop some nodes off the stack
   currNode   = stack.pop();
   sisterNode = sisterStack.pop();
   
   sisterNode.name = currNode.name;
   

   //Does the curr node have children?
   //if yes then add thier children to the main and 
   //sister stacks.  that way we can process them (the children)
   //when we pop them from the stack
   if (currNode.children) {
     sisterNode.children = {};
     sisterNode.type     = "folder";
     
     for(var childId in currNode.children) {
       var childNode = currNode.children[childId];
       
       sisterNode.children[childId] = {};
       
       sisterNode.children[childId].name = childNode.name;
       sisterNode.children[childId].type = "file"; 
       
       stack.push(childNode);        
       sisterStack.push(sisterNode.children[childId]);
     }
   }
 }
 
 return sisterRoot;
}

console.log(lines);
var adjList = makeAdjList(lines);
var rootTree = getSubTree(adjList, "2");

console.log(JSON.stringify(rootTree, null, 3));
