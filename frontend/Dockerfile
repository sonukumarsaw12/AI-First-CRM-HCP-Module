FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
