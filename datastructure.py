#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import re
import pprint
import json

type = "";
hierarchy_pc = dict()
hierarchy    = dict()
h = dict()

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
  
    if re.match(r'^\s*$|^\s*#', line):
        continue

    line_split = line.split(',')

    userid      = line_split[0]
    parentId    = line_split[1]
    childId     = line_split[2]
    childName   = line_split[3]
    isDirectory = line_split[4]
        
    if re.match(r'1', isDirectory):
        xtype = 'folder'

    if re.match(r'0', isDirectory):
        xtype = 'file'

    hierarchy_pc[parentId] = {}
    hierarchy_pc[parentId]['children'] = {}
    hierarchy_pc[parentId]['children'][childId] = {}
    hierarchy_pc[parentId]['children'][childId]['name'] = childName
    hierarchy_pc[parentId]['children'][childId]['type'] = xtype

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

pprint.pprint(hierarchy)
