#!/bin/bash

notebook=$1

cd $notebook
python -m SimpleHTTPServer 8000
