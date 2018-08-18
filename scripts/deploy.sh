#!/bin/bash
# Deployment script for TBME TV Constants
# https://github.com/tbmelabs/tbmelabs-tv-constants

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]]; then
  mvn clean versions:set deploy -Psign,build-extras -DremoveSnapshot -DskipTests
fi
