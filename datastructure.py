#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
import re

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
        
    