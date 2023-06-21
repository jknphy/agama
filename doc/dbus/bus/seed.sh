#!/bin/bash
abusctl() {
    busctl --address=unix:path=/run/agama/bus "$@"
}

DD=org.opensuse.Agama
SS=/${DD//./\/}

abusctl introspect --xml-interface ${DD}1 ${SS}1/Manager \
        > ${DD}1.Manager.bus.xml

look() {
    abusctl tree --list $DD.${1%.*}
    abusctl introspect --xml-interface $DD.${1%.*} $SS/${1//./\/} \
            > $DD.$1.bus.xml
}

look Locale1
look Questions1
look Software1
look Software1.Proposal
look Storage1
look Users1

abusctl introspect --xml-interface \
  ${DD}.Questions1 \
  ${SS}/Questions1 \
  | sed -e '/  <node/,/  <\/node/d' \
  > ${DD}.Questions1.bus.xml
# ^ remove detailed introspection of subnodes

abusctl call \
  ${DD}.Questions1 \
  ${SS}/Questions1 \
  ${DD}.Questions1 \
  New sasas "should I stay or should I go" 2 yes no 1 yes
abusctl introspect --xml-interface \
  ${DD}.Questions1 \
  ${SS}/Questions1/0 \
  > ${DD}.Questions1.Generic.bus.xml

abusctl call \
   ${DD}.Questions1 \
   ${SS}/Questions1 \
   ${DD}.Questions1 \
   NewLuksActivation sssy "/dev/tape1" "ZX Spectrum games" "90 minutes" 1
abusctl introspect --xml-interface \
  ${DD}.Questions1 \
  ${SS}/Questions1/1 \
  > ${DD}.Questions1.LuksActivation.bus.xml
