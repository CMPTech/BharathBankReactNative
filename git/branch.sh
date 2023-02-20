#!/bin/sh

check() {
if [ "$1" = "0" ]
then
 sudo git push -u origin $PRODVER
else
 echo "$PRODVER tag already exists"
fi
}

VER=$1
if [ -z "$VER" ]
then
 echo "Please provide version number in the following syntax v0.0.1"
 exit 0
else
 PRODVER=$VER
 sudo git config credential.helper 'cache --timeout=86400000'
 sudo git branch $PRODVER
 check $?
fi
