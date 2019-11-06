#!/bin/bash

if [ $TRAVIS_TASK == "build" ]
then
    npm install

elif [ $TRAVIS_TASK == "lint" ]
then
    npm install
    npm run lint

else
    echo "Unknown task: $TRAVIS_TASK"
    exit 4
fi
