FROM node:22-alpine AS build
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:1.27-alpine
ENV PORT=8080
ENV BACKEND_HOST=vividmock.railway.internal:8080
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /web/dist /usr/share/nginx/html
