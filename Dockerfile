# Usar una imagen base de Node
FROM node:20

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json (si está disponible)
COPY app/ ./

# Instalar las dependencias del proyecto
RUN npm install

# Exponer el puerto que utiliza tu aplicación (docker-compose.yml sobreescribe este comando)
EXPOSE 3000

# Comando para arrancar la aplicación usando npm start (docker-compose.yml sobreescribe este comando)
CMD ["npm", "start"]
