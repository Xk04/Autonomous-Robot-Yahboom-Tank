#!/bin/bash

cd /home/pi/Documents/yahboomTank || exit 1

# Venv creation
if [ ! -d "ultralytics_venv" ]; then
    python3 -m venv ultralytics_venv
fi

# Flask Server
./ultralytics_venv/bin/python -m webPanel.app