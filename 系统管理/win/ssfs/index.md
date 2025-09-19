# 

1. winfsp + sshfs-win

  net use x: \\sshfs.r\user@host\path\...

    从系统根开始

  net use x: \\sshfs\user@host\path\...

    从用户 home 目录开始

  net use x: \\sshfs.k\user@host\path\...

  net use x: /delete //卸载