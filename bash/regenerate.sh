#!/bin/zsh

./bash/clean.sh

if [ -d ".jhipster" ]
then
    jhipster --with-entities --force
else
    jhipster --force
    jhipster import-jdl jdl.jdl --force
fi

if grep -q angular ".yo-rc.json"; then
    yarn add @angular/material hammerjs
    yarn add @angular/cdk
    yarn add @angular/animations
fi

yo jhipster-elasticsearch-reindexer  --force

./mvnw
