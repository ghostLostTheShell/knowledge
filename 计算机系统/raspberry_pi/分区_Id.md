ID Name Note 

== ==== ==== 

0h empty [空] 

01h DOS 12-bit FAT [MS DOS FAT12] 

02h XENIX root file system [MS XENIX 根文件系统] 

03h XENIX /usr file system (obsolete) [MS XENIX /usr 文件系统] 

04h DOS 16-bit FAT (up to 32M) [MS DOS FAT16 支持32M以下的分区] 

05h DOS 3.3+ extended partition [MS DOS 3.3以上的扩展分区] 

06h DOS 3.31+ Large File System (16-bit FAT, over 32M) [MS DOS 3.31以上大文件系统,支持32M以上分区的FAT16] 

07h QNX 

07h OS/2 HPFS [IBM OS/2 高性能文件系统] 

07h Windows NT NTFS [MS WindowsNT NT文件系统] 

07h Advanced Unix 

08h OS/2 (v1.0-1.3 only) [IBM OS/2 仅仅适用于 1.0-1.3版] 

08h AIX bootable partition, SplitDrive [IBM AIX 引导分区,分割驱动器] 

08h Commodore DOS 

08h DELL partition spanning multiple drives [DELL 跨驱动器分区] 

09h AIX data partition [IBM AIX数据分区] 

09h Coherent filesystem [Coherent 文件系统] 

0Ah OS/2 Boot Manager [IBM OS/2 引导管理器分区] 

0Ah OPUS 

0Ah Coherent swap partition [Coherent 交换分区] 

0Bh Windows 95 with 32-bit FAT [MS Windows 95 FAT32] 


0Ch Windows 95 with 32-bit FAT (using LBA-mode INT 13 extensions) [MS Windows 95 FAT32 使用LBA模式INT13扩展] 


0Eh LBA VFAT (same as 06h but using LBA-mode INT 13) [LBA VFAT 类似06h但使用LBA模式INT13] 

0Fh LBA VFAT (same as 05h but using LBA-mode INT 13) [LBA VFAT 类似06h但使用LBA模式INT13] 

10h OPUS 

11h OS/2 Boot Manager hidden 12-bit FAT partition [IBM OS/2 引导管理器的FAT12隐藏分区] 

12h Compaq Diagnostics partition [Compaq 诊断分区] 

12h Unkown hidden FAT partition 

14h (using Novell DOS 7.0 FDISK to delete Linux Native part) [使用Novell DOS 7.0的FDISK删除Linux原生分区]

14h OS/2 Boot Manager hidden sub-32M 16-bit FAT partition [IBM OS/2 引导管理器的小于等于32M的FAT16隐藏分区] 

16h OS/2 Boot Manager hidden over-32M 16-bit FAT partition [IBM OS/2 引导管理器的大于32M的FAT16隐藏分区] 

17h OS/2 Boot Manager hidden HPFS partition [IBM OS/2 引导管理器的HPFS隐藏分区] 

18h AST special Windows swap file [AST 特殊Windows交换文件分区] 

1Bh Hidden Windows 95 with 32-bit FAT [Windows 95 FAT32隐藏分区] 

1Ch Hidden Windows 95 with 32-bit LBA FAT [Windows 95 LBA模式FAT32隐藏分区] 

1Eh Hidden Windows 95 with LBA BIGDOS [Windows 95 LBA模式BIGDOS隐藏分区] 

21h officially listed as reserved [官方保留] 

23h officially listed as reserved [官方保留] 

24h NEC MS-DOS 3.x 

26h officially listed as reserved [官方保留] 

27h Unkown hidden NTFS partition 

31h officially listed as reserved [官方保留] 

33h officially listed as reserved [官方保留] 

34h officially listed as reserved [官方保留] 

36h officially listed as reserved [官方保留] 

38h Theos 

3Ch PowerQuest PartitionMagic recovery partition [PowerQuest PartitionMagic 恢复分区] 

40h VENIX 80286 

41h Personal RISC Boot [Personal RISC 引导分区] 

42h SFS (Secure File System) by Peter Gutmann [Peter Gutmann安全文件系统] 

4Fh Oberon 

50h OnTrack Disk Manager, read-only partition [OnTrack Disk Manger 只读分区] 

51h OnTrack Disk Manager, read/write partition [Personal RISC 读写分区] 

51h NOVELL 

52h CP/M 

52h Microport System V/386 

53h OnTrack Disk Manager, write-only partition??? [OnTrack Disk Manager只写分区???] 

54h OnTrack Disk Manager (DDO) 

56h GoldenBow VFeature 

57h Unkown hidden FAT partition 

58h Unkown hidden FAT partition 

61h SpeedStor 

63h Unix SysV/386, 386/ix 

63h Mach, MtXinu BSD 4.3 on Mach 

63h GNU HURD 

64h Novell NetWare 286 

65h Novell NetWare (3.11) 

67h Novell 

68h Novell 

69h Novell 

70h DiskSecure Multi-Boot 

71h officially listed as reserved [官方保留] 

73h officially listed as reserved [官方保留] 

74h officially listed as reserved [官方保留] 

75h PC/IX 

76h officially listed as reserved [官方保留] 

80h Minix v1.1 - 1.4a 

81h Minix v1.4b+ 

81h Linux 

81h Mitac Advanced Disk Manager 

82h Linux Swap partition [Linux 交换分区] 

82h Prime 

82h Solaris 

83h Linux native file system (ext2fs/xiafs) [Linux 原生分区] [包括ext3.ext4等]

84h OS/2-renumbered type 04h partition (hiding DOS C: drive) 

86h officially listed as reserved [官方保留] 

87h HPFS Fault-Tolerant mirrored partition [HPFS 容错镜像分区] 

93h Amoeba file system [Amoeba文件系统] 

94h Amoeba bad block table [Amoeba坏块表] 

A1h officially listed as reserved [官方保留] 

A3h officially listed as reserved [官方保留] 

A4h officially listed as reserved [官方保留] 

A5h FreeBSD, BSD/386 

A6h officially listed as reserved [官方保留] 

B1h officially listed as reserved [官方保留] 

B3h officially listed as reserved [官方保留] 

B4h officially listed as reserved [官方保留] 

B6h officially listed as reserved [官方保留] 

B7h BSDI file system (secondarily swap) [BSDI 文件系统第二交换分区] 

B8h BSDI swap partition (secondarily file system) [BSDI 文件系统第二文件分区] 

BCh ATI hidden FAT partition [ 用于保存ATI映像的隐藏分区 ] 

C1h DR DOS 6.0 LOGIN.EXE-secured 12-bit FAT partition [DR DOS 6.0 LOGIN.EXE 安全 FAT12分区] 

C4h DR DOS 6.0 LOGIN.EXE-secured 16-bit FAT partition [DR DOS 6.0 LOGIN.EXE 安全 FAT16分区] 

C6h DR DOS 6.0 LOGIN.EXE-secured Huge partition [DR DOS 6.0 LOGIN.EXE 安全巨分区] 

C7h Syrinx Boot 

D7h DELL hidden FAT partition 

D8h CP/M-86 

DBh CP/M, Concurrent CP/M, Concurrent DOS 

DBh CTOS (Convergent Technologies OS) 

DBh DELL hidden FAT partition 

DDh DELL hidden FAT partition 

DEh DELL hidden FAT partition 

E1h SpeedStor 12-bit FAT extended partition [SpeedStor FAT12扩展分区] 

E3h DOS read-only [DOS只读分区] 

E3h Storage Dimensions 

E4h SpeedStor 16-bit FAT extended partition [SpeedStor FAT16扩展分区] 

E5h officially listed as reserved [官方保留] 

E6h officially listed as reserved [官方保留] 

EBh BeOS partition 

F1h Storage Dimensions 

F2h DOS 3.3+ secondary partition [DOS 3.3以上第二分区] 

F3h officially listed as reserved [官方保留] 

F4h SpeedStor 

F4h Storage Dimensions 

F6h officially listed as reserved [官方保留] 

FEh LANstep

FEh IBM PS/2 IML

FFh Xenix bad block table [Xenix坏块表]