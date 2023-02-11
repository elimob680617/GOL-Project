FROM node:16-alpine as builder

RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock /app/
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN yarn
COPY . /app
RUN yarn codegen
RUN yarn build

FROM nginx:1.21-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html


