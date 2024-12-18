# **M.E.S.S**

## CURRENT STATE

This currently is a work in progress and only exists as a proof of concept. The web ui skeleton is working, but no scripting/automation is currently implemented.



###### What will MESS do?

**M**edia **E**ssentials **S**erver **S**etup aims to help setting up a media server by exposing a web ui to select applications to install (EVERYTHING IS IN DOCKER, NO BARE METAL). It will allow you to pass any necessary configuation settings, as well as use set up scripts, to avoid as much user interaction as possible.

Example scenario. You select radarr, sonarr, prowlarr, and qbittorent from the web ui and click install/apply. MESS will then pull the docker images for each application, retrieve the api keys for each arr app, configure prowlarr/radarr/sonarr with each others respective api keys, set qbit torrent as a download client, and any other necessary settings or configurations. So after installing from the MESS web ui, your applications will be ready to use without needing to configure each one yourself.



###### What will be available to install?

The initial apps that plan to be available are:



**Media Servers**: Jellyfin

**Arr Apps**: Radarr, Sonarr, Prowlarr, Recyclarr, Jellyseerr

**Download Clients**: QbitTorrent, SABNZBD, various blackholes that integrate with debrid providers (rclone), Pinchflat (youtube downloader)

**Management Tools**: Dockge, Dashy, Threadfin, guide2go (schedules direct), m3uparaser (parse VOD content from m3u to create .strm files)



###### Philosophy (Why?)

One of the problems I often see people having when setting up their own servers is that there are a lot of moving pieces with all the docker containers being ran. Each container needs its own bind mounts, but some mount locations need to be accessible to multiple containers, and then throw in docker networks where some containers need to be able to talk to other containers, and it can get overwhelming. It additionally becomes more confusing when the guides people are following use different or sometimes ambiguous host paths in their examples.

The idea here is to eliminate (where possible) using bind mounts and instead used managed volumes. The good things about using managed volumes is that they make any compose file pretty much ready to spin up without needing any user to define host paths to configs or other persistent data. They can allow for a more portable kind of compose file. The downside is that not everyone wants to store their media in a docker managed volume, so to accommodate this, the web ui will allow you to pass host paths if you want.

With that being said - the goal of this set up is to store no amount of hard copies of media files on your actual drive. This set up should ideally utilize two outside services. A iptv subscription that contains VOD content, and some kind debrid service like Torbox or RealDebrid. By utilizing the m3uparser container to create a .strm library from a m3u url, you can have a huge library in Jellyfin where the only space being taken up on your drive is the metadata Jellyfin stores. A .strm library from a parsed IPTV VOD url, which contains ~10,000 movies and ~3,000 TV series takes up about 60 gigs of metadata when its all been imported. You then combine jellyseerr + arrs + blackhole + debrid + rclone for any additional content and you can have a huge library of media without the need for terabytes of drive space. In this scenario using managed volumes to store media can make a lot of sense as it gives us the benefit of not needing the user define any volume mounts for blackholes, rclone, sonarr/radarr. It can all work magically behind the scenes.


