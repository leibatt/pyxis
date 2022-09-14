#!/bin/bash
set -x
for notebook in pyxis pyxis-transformations pyxis-relationships pyxis-analytic-knowledge pyxis-domain-knowledge pyxis-insight pyxis-objective pyxis-task
do
  rm -r $notebook
  mkdir $notebook
  tar -xzf "${notebook}.tgz" --directory $notebook
  cp BPD_Part_1_Victim_Based_Crime_Data2.json $notebook
done
