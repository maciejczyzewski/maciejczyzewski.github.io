---
layout: article
title:  "Enable AirDrop on older Macs"
date:   2014-08-19 15:42:00
---

![Happy devices](https://lh3.googleusercontent.com/vR174PJseQp8aF4bJE5-vBpGtAb4ukPZv2rNRqidjZ0mAj6reauO0w3QDp5Dl5Z-KVrrFUvGUMdiJcMUpvgNWR8IwHeOsmbkAP7NxhFXj6u4PcpKB-Z22RfzYFJtv-4r0yC2y8Y0iNkkQt5x57cspmh2vjAIObmJVVpv5wty-5Nt8K4yUTRmkN-d51Nx2aoPqFzj7_Ze0JglUCtqtPoGHU4Nuf2j2UTzW2b3tKpGFLFWB4WbvaisI-8dqgyU016g__vyqwCo0mquWOr79_gT4QUQ4x62Boxs8CcGbmRgpLUFh1r5uEXpj-pYURb-7VMMCxXDZpxgVrC0jBLVXPGK0X5oGppTjb59nSU2m6YcNJkodyj7LjytjhXWDyDGjPVNS5suqKG6yUYnStFjbKflat9q69aWh-DaOtdmkhvBqMs4HaBDJIblaIre6FAp2i3MQwFfYZQ_yJkFZAjlBqooIVezZgmoVip7Hhm2BcQBf0JFtD3DPa0Q0hjiCtVsrGxsSs2OJVwRiSQvdjF_yW7F_gMocD87khABMiDUS4z4nVbsPo7-jx1CS1FqYHTnFLUSnl8FJEcGKJlwBBsBnVwx5QZ3GfpVel8=w1223-h772-no)

AirDrop is a great feature to send files between Macs quickly and easily without dealing with pesky file sharing apps. Trouble is, it’s only on WiFi and on more recent Macs.

If your Mac doesn’t currently support AirDrop, you can enter the following command to use it, as well as to use it over ethernet:

    $ defaults write com.apple.NetworkBrowser BrowseAllInterfaces -bool TRUE

You’ll need to restart the Finder, the quickest way is to use the `killall` command which will restart it:

    $ killall Finder

And it works fine! I wonder why this feature is disabled for older Macs. To revert the changes, enter:

    $ defaults write com.apple.NetworkBrowser BrowseAllInterfaces -bool FALSE
