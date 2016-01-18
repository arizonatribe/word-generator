SHELL := /bin/bash

VERSION = $(shell cat VERSION | head -n 1)

docker:
	@docker build -t word-generator:$(VERSION) ./
	@docker tag -f word-generator:$(VERSION) word-generator:latest
