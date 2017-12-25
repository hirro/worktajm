#!/usr/bin/env bash

rm -rf .angular-cli.json
rm -rf .editorconfig
rm -rf .gitattributes
rm -rf .gitignore
rm -rf .idea
rm -rf .jhipster
rm -rf .mvn
rm -rf mvnw
rm -rf mvnw.cmd
rm -rf node_modules
rm -rf package.json
rm -rf pom.xml
rm -rf proxy.conf.json
rm -rf README.md
rm -rf src
rm -rf target
rm -rf .travis.yml
rm -rf tsconfig-aot.json
rm -rf tsconfig.json
rm -rf tslint.json
rm -rf webpack
rm -rf worktajm.iml
rm -rf yarn.lock

jhipster --with-entities --force

# jhipster --force
# jhipster import-jdl jdl.jdl --force

yarn add @angular/material hammerjs
yarn add  @angular/cdk
yarn add @angular/animations

yo jhipster-elasticsearch-reindexer  --force

./mvnw
