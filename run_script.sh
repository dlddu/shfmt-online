#!/bin/bash

PROJECT_NAME=shfmt-online

if test -f .env; then
	source .env
else
	DOMAIN=$1
	CERTIFICATE_EXPIRATION_EMAIL=$2
fi

if test -z "$DOMAIN" || test -z "$CERTIFICATE_EXPIRATION_EMAIL"; then
	echo "Usage: $0 DOMAIN CERTIFICATE_EXPIRATION_EMAIL"
	return 1
fi

SETUP_REVERSE_PROXY=$(curl https://api.github.com/gists/80fade618d3796df88a48e6d640c19ea)

echo "$SETUP_REVERSE_PROXY" | jq -r '.files."docker-compose-reverse-proxy.yml".content' >docker-compose-reverse-proxy.yml
echo "$SETUP_REVERSE_PROXY" | jq -r '.files."setup_reverse_proxy.sh".content' | sh -s -- "$DOMAIN" "$CERTIFICATE_EXPIRATION_EMAIL"

docker compose up -d

while ! docker compose exec reverse-proxy curl -f http://localhost; do
	sleep 1
done

curl https://api.github.com/gists/1bd13929dc5b291cba2853824a5fcd26 | jq -r '.files."generate_https_proxy_conf.sh".content' | sh -s -- "$DOMAIN" $PROJECT_NAME 3000 >conf.d/$PROJECT_NAME.conf

while ! docker compose exec reverse-proxy nginx -t; do
	sleep 1
done

docker compose exec reverse-proxy nginx -s reload