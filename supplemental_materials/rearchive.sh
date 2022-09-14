#!/bin/bash
set -x

outfolder="observable_anonymized"
rm -r $outfolder
mkdir $outfolder
for notebook in pyxis pyxis-transformations pyxis-relationships pyxis-analytic-knowledge pyxis-domain-knowledge pyxis-insight pyxis-objective pyxis-task
do
  tar -czf "${outfolder}/${notebook}-anonymized.tgz" $notebook
done
cp run-notebook.sh $outfolder
cp README.md $outfolder
