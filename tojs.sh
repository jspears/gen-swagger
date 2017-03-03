#!/usr/bin/env bash
help(){
  echo "$0 need a file" >&2;
 exit 1;
}
[  -f "$1" ] || [  -d $1 ] || help

CLAZZ=$(basename ${1%.js})
function headCheck(){
if grep -q "(function (codegen) {" $1; then
 sed -e "/(function (codegen) {/,\$!d;s/(function (codegen) {//;/[[:space:]]*\w*.Codegen = $CLAZZ/,\$d" $1
else
 cat $1
fi

}
NL=$(echo -e "\n")
function subs(){

headCheck $1 |\
sed -e 's/var ArrayList = java\.java\.ArrayList;$/import {ArrayList} from "\.\/java\/java";/' | \
sed -e 's/var HashMap = java\.java\.HashMap;$/import {HashMap} from "\.\/java\/java";/' | \
sed -e 's/var HashSet = java\.java\.HashSet;$/import {HashSet} from "\.\/java\/java";/' | \
sed -e 's/var LoggerFactory = org\.slf4j\.LoggerFactory;/import LoggerFactory from "\.\/java\/LoggerFactory";/' |\
sed -e 's/var StringUtils = org\.apache\.commons\.lang3\.StringUtils;/import StringUtils from "\.\/java\/StringUtils";/' |\
sed -e 's/var File = java\.io\.File;/import File from "\.\/java\/File";/' |\
sed -e 's/var LinkedHashMap = java\.java\.LinkedHashMap;/import {LinkedHashMap} from "\.\/java\/java";/'|\
sed -e 's/var LinkedHashSet = java\.java\.LinkedHashSet;/import {LinkedHashSet} from "\.\/java\/java";/'|\
sed -e 's/var TreeMap = java\.java\.TreeMap;/import {TreeMap} from "\.\/java\/java";/'|\
sed -e 's/var TreeSet = java\.java\.TreeSet;/import {TreeSet} from "\.\/java\/java";/'|\
sed -e 's/var Arrays = java\.java\.Arrays;/import {Arrays} from "\.\/java\/java";/'|\
sed -e 's/var Collections = java\.java\.Collections;/import {Collections} from "\.\/java\/java";/'|\
sed -e 's/var Json = io\.swagger\.java\.Json;/import Json from "\.\/Json";/'|\
sed -e 's/var Mustache = com\.samskivert\.mustache\.Mustache;/import Mustache from "\.\/java\/Mustache";/'|\
sed -e 's/var ObjectUtils = org\.apache\.commons\.lang3\.ObjectUtils;/import ObjectUtils from "\.\/java\/ObjectUtils";/'|\
sed -e 's/var \(\.*\) = io\.swagger\.models\.auth\.\1;/import \1 from ".\/auth\/\1\";/g' |\
sed -e 's/var \(.*\) = io\.swagger\.models\.\1;/import \1 from ".\/\1\";/g' |\
sed -e "s/class $CLAZZ/export default class $CLAZZ/" |\
#boolean
sed -e 's/javaemul.internal.BooleanHelper.FALSE.toString()/"false"/g' |\
sed -e 's/javaemul.internal.BooleanHelper.TRUE.toString()/"true"/g' |\
sed -e "s/new java\.lang\.StringBuilder()/new StringBuilder()/g"|\
#import properties
sed -e 's/var \(.*\)Property \= io\.swagger\.models\.properties\.\(.*\)Property;/import \{\1Property\} from ".\/models\/properties"; /;'|\
#rename logger
sed -e 's/LOGGER_\$LI\$/Log/g' |\
#imports extended class
sed -e "s/\(class \(.*\) extends codegen.\(.*\) {\)/import \3 from '\.\/\3';$NL class \2 extends \3 {/"|\
grep -v "})($CLAZZ = codegen\.$CLAZZ || (codegen\.$CLAZZ = {}));" |\
grep -v "})(swagger = io.swagger || (io.swagger = {}));"|\
grep -v "})(io || (io = {}));"|\

cat
}

if [ -d $1 ]; then
  for f in $(find $1 -type f -name '*.js'); do
     subs $f > $f-
  done
  for f in $(find $1 -type f -name '*.js-'); do
    mv $f ${f%-}
  done
else
 subs $1
fi
