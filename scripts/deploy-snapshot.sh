#!/bin/bash
# Deployment script for TBME TV Constants
# https://github.com/tbmelabs/tbmelabs-tv-constants

if [[ $TRAVIS_BRANCH == "development" && $TRAVIS_PULL_REQUEST == "false" ]]; then
  mvn deploy -Pbuild-extras -DskipTests
fi
