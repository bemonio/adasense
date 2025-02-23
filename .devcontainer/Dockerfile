FROM node:18

# Instalar Java JDK y herramientas esenciales
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    unzip \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Descargar y configurar Android SDK
RUN mkdir -p /home/node/android-sdk/cmdline-tools && \
    cd /home/node/android-sdk/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-9477386_latest.zip && \
    mv cmdline-tools latest && \
    rm commandlinetools-linux-9477386_latest.zip

# Aceptar licencias del SDK
RUN yes | /home/node/android-sdk/cmdline-tools/latest/bin/sdkmanager --licenses

# Instalar plataforma Android y herramientas necesarias
RUN /home/node/android-sdk/cmdline-tools/latest/bin/sdkmanager \
    "platform-tools" \
    "platforms;android-31" \
    "build-tools;31.0.0"

# Establecer permisos correctos para node
RUN chown -R node:node /home/node

USER node
