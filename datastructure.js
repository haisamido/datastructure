"use strict";

var fs = require('fs');
var readline = require('readline');

var i;
var line;


// Need to convert this to STDIN
// Read data from STDIN
//  STDIN must be comma separated data with the following columns:
//  userid,parentid,childid,childname,idirectory
var lines = fs.readFileSync('./examples/hierarchy6.csv').toString().split("\n");

// Datastructure objects
var hierarchy_pc = {}; // Intermediary object to store parent to child relationship
var hierarchy    = {}; // Final object to store parent to child relationship

/*#-----------------------------------------------------------------------------
# Step 1 of 3
#
# Read lines from STDIN
#  STDIN must be comma separated data with the following columns:
#  userid,parentid,childid,childname,idirectory
#
#-----------------------------------------------------------------------------*/
for(i in lines) {
  
  line = lines[i];
  
  var line_split  = line.split(",");
  var userid      = line_split[0];
  var parentId    = line_split[1];
  var childId     = line_split[2];
  var childName   = line_split[3];
  var isDirectory = line_split[4];
  
  hierarchy_pc[parentId] = {};
  hierarchy_pc[parentId].children = {};
  hierarchy_pc[parentId].children[childId] = JSON.stringify( {"name": childName, "type": isDirectory} );

}
/*----------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
# Step 2 of 3 (don't work correctly)
#
# Determine if a child is also a parent; if so, add it to $hierarchy
#
#-----------------------------------------------------------------------------*/
for (var parentId in hierarchy_pc) {
  
  for (var childId in hierarchy_pc[parentId].children) {
    hierarchy[parentId] = {};
    hierarchy[parentId].children = {};
    // Copy $hierarchy_pc to $hierarchy
    hierarchy[parentId].children = hierarchy_pc[parentId].children;

    // Is child $childId also a parent ?
    if (hierarchy[childId] != null) {
      hierarchy[parentId].children[childId]          = {};
      hierarchy[parentId].children[childId].children = {};
      hierarchy[parentId].children[childId].children = hierarchy_pc[childId].children;
     }
    
  }

}
/*----------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------
# Step 3 of 3
#
# Delete keys whose parent is not <HOME>. They are aliens.
#
#-----------------------------------------------------------------------------*/
for (var parentId in hierarchy ) { 
  if( parentId.match(/\<HOME\>/i) == null ) {
//    delete hierarchy[parentId];
  }
}
/*----------------------------------------------------------------------------*/

console.log(hierarchy);

