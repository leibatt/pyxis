#python3 -m venv env
#env/bin/pip install numpy

rm sleep_generated.csv
env/bin/python data_generator.py sleep_sample.csv sleep_generated.csv 1009 300 0.6
