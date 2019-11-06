#!/bin/bash

if [ $TRAVIS_OS_NAME == "linux" ]
then
    sudo add-apt-repository -y ppa:deadsnakes/ppa
    sudo apt-get update
    sudo apt-get install python3-venv python3.7 python3.7-venv python3.6-venv python3.7-dev

elif [ $TRAVIS_OS_NAME == "windows" ]
then
    choco install python --version 3.7.5

elif [ $TRAVIS_OS_NAME == "osx" ]
then
    echo -e "\e[31mOSX is not currently supported\e[39m"
    exit 2

else
    echo -e "\e[31mUnknown OS: $TRAVIS_OS_NAME\e[39m"
    exit 3
fi
