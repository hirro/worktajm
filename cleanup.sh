#!/bin/zsh

rm -rf .angular-cli.json
rm -rf .idea
rm -rf .mvn
rm -rf mvnw
rm -rf mvnw.cmd
rm -rf package.json
rm -rf pom.xml
rm -rf postcss.config.js
rm -rf proxy.conf.json
rm -rf src
rm -rf tsconfig-aot.json
rm -rf tsconfig.json
rm -rf tslint.json
rm -rf webpack
rm -rf yarn.lock

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
