#!/bin/bash
# A simple variable example
myvariable=$(xclip -o)
node newPdfTest $myvariable
echo $myvariable