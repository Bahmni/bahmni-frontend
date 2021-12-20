FROM nginx
COPY nginx-config/default.conf /etc/nginx/conf.d/
COPY nginx-config/nginx.crt /etc/ssl/
COPY nginx-config/nginx.key /etc/ssl
COPY /dist /usr/share/nginx/html