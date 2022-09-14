#!/bin/bash
set -x

for f in $(grep -irl "leibatt" pyxis*)
do
  #echo $f
  #sed -i "" "s/@leibatt/ANONYMIZED/g" $f
  sed -i "" "s/\(https:\/\/observablehq.com\/\)@leibatt/\1ANONYMIZED/" $f
  sed -i '' 's/\("name": "\)@leibatt/\1ANONYMIZED/' $f
  sed -i '' 's/\(import define from "\)@leibatt/\1ANONYMIZED/' $f
  sed -i "" "s/Leilani Battle/ANONYMIZED/" $f
  sed -i "" "s/https:\/\/raw\.githubusercontent\.com\/leibatt\/pyxis\/main\/datasets\/BPD_Part_1_Victim_Based_Crime_Data2\.json/\/BPD_Part_1_Victim_Based_Crime_Data2\.json/g" $f
done
