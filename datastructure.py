#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import re

type = "";
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
  
    if re.match(r'^\s*$|^\s*#', line):
        continue
      
    print line,

    line_split = line.split(',')

    userid      = line_split[0]
    parentId    = line_split[1]
    childId     = line_split[2]
    childName   = line_split[3]
    isDirectory = line_split[4]
        
    if isDirectory == 1:
        type = 'folder'

    if isDirectory == 0:
        type = 'file'

    hierarchy[parentId]['children'][childId] = { 'name': childName }
    