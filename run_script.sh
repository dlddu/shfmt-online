#!/bin/bash

PROJECT_NAME=shfmt-online
DOMAIN=$1
CERTIFICATE_EXPIRATION_EMAIL=$2

SETUP_REVERSE_PROXY=$(curl https://api.github.com/gists/5f705a3d30773203fd87e015d519b647)

echo "$SETUP_REVERSE_PROXY" | jq -r '.files."docker-compose-reverse-proxy.yml".content' >docker-compose-reverse-proxy.yml
echo "$SETUP_REVERSE_PROXY" | jq -r '.files."setup_reverse_proxy.sh".content' | sh -s -- "$DOMAIN" "$CERTIFICATE_EXPIRATION_EMAIL"

docker compose up -d

while ! docker compose exec reverse-proxy curl -f http://localhost; do
	sleep 1
done

curl https://api.github.com/gists/08cae87693f16def7603238df4486248 | jq -r '.files."generate_https_proxy_conf.sh".content' | sh -s -- "$DOMAIN" $PROJECT_NAME 3000 >conf.d/$PROJECT_NAME.conf

while ! docker compose exec reverse-proxy nginx -t; do
	sleep 1
done

docker compose exec reverse-proxy nginx -s reload

curl -L https://notification.dlddu.com/notify/csj6922 -d "$PROJECT_NAME deployment is complete"