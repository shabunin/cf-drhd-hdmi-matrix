cf-drhd-hdmi-matrix
===================
CommandFusion module for DrHD HDMI matrix


There's two ways to control Dr.HD matrix: via TCP and via RS232.

Default port is 8000. To change IP address you should use native application.

In my case I use Global Cache IP2SL. RS232 Settings: speed: 57600, stopbots: 1, databits: 8, parity: none.


===================

HDMI Matrix-8x8 Help Info
FW Version: 1.87

============= System Information Command

? Print Help Information

HELP Print Help Information

STATUS Print System Status And Port Status

============= System Control Command

PON Power On, System Run On Normal State

POFF Power Off, System Run On Power Save State

IR ON/OFF Set System IR Control On Or Off

KEY ON/OFF Set System KEY Control On Or Off

APM ON/OFF Set Advanced Process Mode On Or Off

BEEP ON/OFF Set Onboard Beep On Or Off

RESET Reset System To Default Setting

(Should Type "Yes" To Confirm, "No" To Discard)

============= Input And Output Port Control Command

OUT xx ON/OFF Set OUTPUT:xx On Or Off

OUT xx FR yy Set OUTPUT:xx From INPUT:yy

xx=00: Select All OUTPUT Port

xx=[01...08]: Select One OUTPUT Port

yy=[01...08]: Select One INPUT Port


EDID xx CP yy Set Input:xx EDID Copy From Output:yy

EDID xx DF zz Set Input:xx EDID To Default EDID:zz

xx=00: Select All INPUT Port

xx=[01...08]: Select One INPUT Port

yy=[01...08]: Select One OUTPUT Port

zz=00: HDMI 1080p@60Hz, Audio 2CH PCM

zz=01: HDMI 1080p@60Hz, Audio 5.1CH PCM/DTS/DOLBY

zz=02: HDMI 1080p@60Hz, Audio 7.1CH PCM/DTS/DOLBY/HD

zz=03: HDMI 1080i@60Hz, Audio 2CH PCM

zz=04: HDMI 1080i@60Hz, Audio 5.1CH PCM/DTS/DOLBY

zz=05: HDMI 1080i@60Hz, Audio 7.1CH PCM/DTS/DOLBY/HD

zz=06: HDMI 1080p@60Hz/3D, Audio 2CH PCM

zz=07: HDMI 1080p@60Hz/3D, Audio 5.1CH PCM/DTS/DOLBY

zz=08: HDMI 1080p@60Hz/3D, Audio 7.1CH PCM/DTS/DOLBY/HD

zz=09: HDMI 4K2K, Audio 2CH PCM

zz=10: HDMI 422K, Audio 5.1CH PCM/DTS/DOLBY

zz=11: HDMI 4K2K, Audio 7.1CH PCM/DTS/DOLBY/HD

zz=12: DVI 1280x1024@60Hz, Audio None

zz=13: DVI 1920x1080@60Hz, Audio None

zz=14: DVI 1920x1200@60Hz, Audio None
