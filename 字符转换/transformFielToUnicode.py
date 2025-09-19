import os
import sys



cwd = os.getcwd()

sys.argv[1:]

read_file = os.path.join(cwd, sys.argv[1])


newcontent = ""
with open(read_file, 'r', encoding="utf-8") as f:
  alllines = f.readlines()
  for line in alllines:
    newline = ""
    for c in line:
      dec = ord(c)
      
      if(dec <= 0x7f):
        newline = newline + c
      
      else:
        newline = newline + "\\u{:0>4x}".format(dec)
    
    newcontent = newcontent + newline


newFileName = sys.argv[1].split(".")[1]
write_file = os.path.join(cwd, newFileName)
with open(write_file, 'w', encoding="utf-8") as f:
  f.write(newcontent)




          