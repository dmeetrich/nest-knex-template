#!/bin/sh

function message {
    MESSAGE=$(echo $1 | sed 's/"/\\\"/g' | sed "s/'/\\\'/g" )
    echo $MESSAGE
    curl -X POST --data-urlencode "payload={\"channel\":\"$SLACK_CHANNEL\",\"text\": \"$MESSAGE\"}" $SLACK_WEBHOOK > /dev/null 2>&1
}

function successMessage {
    MESSAGE=$(echo $1 | sed 's/"/\\\"/g' | sed "s/'/\\\'/g" )
    curl -X POST --data-urlencode "payload={\"channel\":\"$SLACK_CHANNEL\",\"attachments\":[{\"text\": \"$MESSAGE\", \"color\": \"good\"}]}" $SLACK_WEBHOOK > /dev/null 2>&1
}

function plainMessage {
    MESSAGE=$(echo $1 | sed 's/"/\\\"/g' | sed "s/'/\\\'/g" )
    echo "> $MESSAGE"
    curl -X POST --data-urlencode "payload={\"channel\":\"$SLACK_CHANNEL\",\"attachments\":[{\"text\": \"$MESSAGE\"}]}" $SLACK_WEBHOOK > /dev/null 2>&1
}

function errorMessage {
    MESSAGE=$(echo "${1}" | sed 's/"/\\\"/g' | sed "s/'/\\\'/g" )
    echo "Error: $MESSAGE"
    curl -X POST --data-urlencode "payload={\"channel\":\"$SLACK_CHANNEL\",\"attachments\":[{\"text\": \"$MESSAGE\", \"color\": \"danger\"}]}" $SLACK_WEBHOOK > /dev/null 2>&1
}


CMD=$*

message "Running \`$CMD\` at *db-manager* [*$NODE_ENV*]"
FILE=$(mktemp)
$CMD > $FILE 2>&1
RES=$?
if [ $RES -eq 0 ]; then
  successMessage "DONE: $(cat $FILE | tail -n 1)";
else
  errorMessage "$(cat $FILE | head -n 30)";
fi
cat $FILE
exit $RES
