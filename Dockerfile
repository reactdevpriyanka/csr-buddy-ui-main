FROM 278833423079.dkr.ecr.us-east-1.amazonaws.com/plat/node:16-alpine
WORKDIR /app
COPY . /app
CMD ["npx", "next", "start"]
