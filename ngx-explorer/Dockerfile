FROM node:lts-alpine3.19 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:stable-alpine3.17
COPY --from=build /app/dist/angular/browser /usr/share/nginx/html
COPY ./conf/* /etc/nginx/conf.d/

EXPOSE 80