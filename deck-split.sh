#!/usr/bin/env bash

  mkdir -p logs
  : > logs/ok.log
  : > logs/err.log

  npm run deck:override \
      > >(tee -a logs/ok.log  | sed $'s/^/\e[32m[OK]\e[0m /') \
      2> >(tee -a logs/err.log | sed $'s/^/\e[31m[ERR]\e[0m /' >&2)
