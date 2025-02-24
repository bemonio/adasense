FROM node:20

# Instalar Java JDK y herramientas esenciales
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor | tee /usr/share/keyrings/adoptium-keyring.gpg > /dev/null \
    && echo "deb [signed-by=/usr/share/keyrings/adoptium-keyring.gpg] https://packages.adoptium.net/artifactory/deb bookworm main" | tee /etc/apt/sources.list.d/adoptium.list \
    && apt-get update \
    && apt-get install -y temurin-21-jdk \
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
