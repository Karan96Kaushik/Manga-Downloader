#!/bin/bash
# A simple variable example
myvariable=$(xclip -o)
node manga-test2 $myvariable
echo $myvariable