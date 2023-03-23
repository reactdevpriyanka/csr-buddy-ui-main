#!/bin/sh
source .env.local
echo "starting gateway server for env:" $ENVIRONMENT

export ENVIRONMENT=$ENVIRONMENT
export CSRB_GATEWAY_PORT=$CSRB_GATEWAY_PORT
export ATHENA_GATEWAY_PATH="/props/csrb-gateway?env=$ENVIRONMENT"
export OAUTH_SECRET=$(aws secretsmanager get-secret-value --profile $AWS_PROFILE --region $AWS_REGION --secret-id=/chewy/$ENVIRONMENT/$AWS_REGION/csrb-gateway/client_secret --query SecretString | tr -d '"')
export OAUTH_U2S_SECRET=$(aws secretsmanager get-secret-value --profile $AWS_PROFILE --region $AWS_REGION --secret-id=/chewy/$ENVIRONMENT/$AWS_REGION/cs-platform/secret --query SecretString --output text | jq '.U2S_CLIENT_SECRET' | tr -d '"')

case "$ENVIRONMENT" in
   "dev" )
      export TIERB_BASE_URL="${TIERB_BASE_URL_DEV:-https://csrb-api.use1.csbb.dev.chewy.com}"
      export REDIS_HOST="dev-use1-csrb-gateway-cache.fqfty1.clustercfg.use1.cache.amazonaws.com:6379"
      export ATHENA_BASE_URI="https://central-config-service.plat.dev.chewy.com/v1"
      export OAUTH_ISSUER_URI="https://auth-integration.chewy.com/auth/realms/chewy-auth"
      export ORDER_SERVICE_BASE_URI="https://order-api.opta.dev.chewy.com"
      ;;
   "qat" )
      export TIERB_BASE_URL="${TIERB_BASE_URL_QAT:-https://blue-csrb-api.use1.csbb.qat.chewy.com}"
      export REDIS_HOST="qat-use1-csrb-gateway-cache.mpppgw.clustercfg.use1.cache.amazonaws.com:6379"
      export ATHENA_BASE_URI="https://central-config-service.plat.qat.chewy.com/v1"
      export OAUTH_ISSUER_URI="https://auth-qa.chewy.com/auth/realms/chewy-auth"
      export ORDER_SERVICE_BASE_URI="https://order-api.opta.qat.chewy.com"
      ;;
   "stg" )
      export TIERB_BASE_URL="${TIERB_BASE_URL_STG:-https://blue-csrb-api.use1.csbb.stg.chewy.com}"
      export REDIS_HOST="stg-use1-csrb-gateway-cache.bweyub.clustercfg.use1.cache.amazonaws.com:6379"
      export ATHENA_BASE_URI="https://central-config-service.plat.stg.chewy.com/v1"
      export OAUTH_ISSUER_URI="https://auth-stg.chewy.com/auth/realms/chewy-auth"
      export ORDER_SERVICE_BASE_URI="https://order-api.opta.stg.chewy.com"
      ;;
   "prd" )
      export TIERB_BASE_URL="${TIERB_BASE_URL_PRD:-https://blue-csrb-api.use1.csbb.prd.chewy.com}"
      export REDIS_HOST="prd-use1-csrb-gateway-cache.wjmkaa.clustercfg.use1.cache.amazonaws.com:6379"
      export ATHENA_BASE_URI="https://central-config-service.plat.prd.chewy.com/v1"
      export OAUTH_ISSUER_URI="https://auth.chewy.com/auth/realms/chewy-auth"
      export ORDER_SERVICE_BASE_URI="https://order-api.opta.prd.chewy.com"
      ;;
esac

docker-compose -f gateway-docker-compose.yml down
docker-compose -f gateway-docker-compose.yml up --build > /dev/null 2>&1
