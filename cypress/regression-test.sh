#!/bin/sh
source ../.env.local
echo "starting gateway server for env:" $ENVIRONMENT

export ENVIRONMENT=$ENVIRONMENT

case "$ENVIRONMENT" in
   "dev" )
      export TIERB_BASE_URL="https://csrb-api.use1.csbb.dev.chewy.com"
      export REDIS_HOST="dev-use1-csrb-gateway-cache.fqfty1.clustercfg.use1.cache.amazonaws.com:6379"
      export ACCOUNT_SERVICE_URI="https://account.use1.plat.dev.chewy.com/v1/accounts/sessions"
      ;;
   "qat" )
      export TIERB_BASE_URL="https://csrb-api.use1.csbb.qat.chewy.com"
      export REDIS_HOST="qat-use1-csrb-gateway-cache.mpppgw.clustercfg.use1.cache.amazonaws.com:6379"
      export ACCOUNT_SERVICE_URI="https://account.use1.plat.qat.chewy.com/v1/accounts/sessions"
      ;;
   "stg" )
      export TIERB_BASE_URL="https://csrb-api.use1.csbb.stg.chewy.com"
      export REDIS_HOST="stg-use1-csrb-gateway-cache.bweyub.clustercfg.use1.cache.amazonaws.com:6379"
      export ACCOUNT_SERVICE_URI="https://account.use1.plat.stg.chewy.com/v1/accounts/sessions"
      ;;
   "local" )
      export TIERB_BASE_URL="http://localhost:8081"
      export REDIS_HOST=""
      export ACCOUNT_SERVICE_URI=""
      ;;
esac

docker-compose -f regression-docker-compose.yml down
docker-compose -f regression-docker-compose.yml up
