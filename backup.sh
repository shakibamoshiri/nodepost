#!/bin/bash
_D_=$(date '+%F');

A=home
B=build
C=database
D=main-html
tar czf $A-$_D_.tar.gz $A $B $C $D
