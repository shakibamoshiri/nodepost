#!/bin/bash
rsync --update --delete --delete-excluded --exclude-from=.rsyncignore --port=22 \
    -azv -e "ssh -p 22 -i /home/$USER/.ssh/your-file_rsa"  /your-local-path/ username@your-domain-name.com:/your-remote-path/
