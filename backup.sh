#!/bin/bash
_D_=$(date '+%F');

A=home
B=build
C=database
tar czf $A-$_D_.tar.gz $A $B $C
