#!/bin/bash
PHPPATH=$1
HTMLFILE=$2
OUTPUTPDF=$3
echo $PHPPATH
echo $HTMLFILE
echo $OUTPUTPDF
php $PHPPATH $HTMLFILE $OUTPUTPDF