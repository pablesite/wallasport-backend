#!/bin/bash
echo "Descargando actualización..." && \
git pull && \
echo "Instalando dependencias..." && \
npm i && \
echo "Reiniciando servicio..." && \
pm2 restart "WSbackend" && \
echo "Despliegue realizado con éxito!"
