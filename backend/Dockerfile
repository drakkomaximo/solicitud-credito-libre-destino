FROM node:20-alpine
WORKDIR /app
COPY package*.json bun.lockb ./
RUN npm install -g bun
RUN bun install
COPY . .
RUN bunx prisma generate
RUN bun run build
EXPOSE 3000
CMD ["node", "dist/main"]
