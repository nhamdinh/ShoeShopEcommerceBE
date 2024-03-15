# FROM node:18.19.0-alpine

# WORKDIR /app

# COPY . .

# RUN npm install

# CMD ["npm", "start"]

FROM node:18.19.0-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/app

COPY . ./

# Cài đặt các dependencies của ứng dụng
RUN npm install

# Khai báo cổng mà ứng dụng lắng nghe
EXPOSE 5000
# EXPOSE 3002

# Chạy lệnh để khởi động ứng dụng trong container
CMD npm run dev
# RUN npm run migration:run
# CMD npm run start:prod