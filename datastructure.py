#!/usr/bin/python

import sys
import re
import pprint
import json

# Datastructure Hashes
hierarchy_pc = dict()
hierarchy    = dict()

# Read data from STDIN
#  STDIN must be comma separated data with the following columns:
#  userid,parentid,childid,childname,idirectory

#-------------------------------------------------------------------------------
# Step 1 of 3
#
# Read lines from STDIN
#  STDIN must be comma separated data with the following columns:
#  userid,parentid,childid,childname,idirectory
#
#-------------------------------------------------------------------------------
for line in sys.stdin:
  
    if re.match(r'^\s*$|^\s*#', line): continue

    line_split = line.split(',')

    userid      = line_split[0]
    parentId    = line_split[1]
    childId     = line_split[2]
    childName   = line_split[3]
    isDirectory = line_split[4]
        
    # Determine if datastructure element is a folder or file
    #  this needs improvement
    if re.match(r'1', isDirectory): xtype = 'folder'
    if re.match(r'0', isDirectory): xtype = 'file'

    hierarchy_pc[parentId] = {}
    hierarchy_pc[parentId]['children'] = {}
    hierarchy_pc[parentId]['children'][childId] = {}

    # Add name & type of datastructure element to hash for $parentId & $childId
    hierarchy_pc[parentId]['children'][childId]['name'] = childName
    hierarchy_pc[parentId]['children'][childId]['type'] = xtype
#-------------------------------------------------------------------------------

#-------------------------------------------------------------------------------
# Step 2 of 3
#
# Determine if a child is also a parent; if so, add it to $hierarchy
#
#-------------------------------------------------------------------------------
for parentId in hierarchy_pc:
    hierarchy[parentId] = {}
    hierarchy[parentId]['children'] = {}

    for childId in hierarchy_pc[parentId]['children']:
        hierarchy[parentId]['children'] = hierarchy_pc[parentId]['children']

        if childId in hierarchy_pc:
            hierarchy[parentId]['children'] = {}
            hierarchy[parentId]['children'][childId] = {}
            hierarchy[parentId]['children'][childId]['children'] = {}
            hierarchy[parentId]['children'][childId]['children'] = hierarchy_pc[childId]['children']
#-------------------------------------------------------------------------------

#-------------------------------------------------------------------------------
# Step 3 of 3
#
# Delete keys whose parent is not <HOME>. They are aliens.
#
#-------------------------------------------------------------------------------
# Not ready yet

pprint.pprint(hierarchy)
