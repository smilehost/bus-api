FROM jenkins/jenkins:lts

USER root

# Install dependencies
RUN apt-get update && apt-get install -y curl unzip wget gnupg software-properties-common

# ✅ Install Java 22 (Temurin OpenJDK)
ENV JAVA_VERSION=22
ENV JAVA_HOME=/usr/lib/jvm/jdk-${JAVA_VERSION}
ENV PATH="$JAVA_HOME/bin:$PATH"

RUN mkdir -p $JAVA_HOME && \
    curl -L -o /tmp/openjdk.tar.gz https://github.com/adoptium/temurin22-binaries/releases/download/jdk-22%2B36/OpenJDK22U-jdk_x64_linux_hotspot_22_36.tar.gz && \
    tar -xzf /tmp/openjdk.tar.gz --strip-components=1 -C $JAVA_HOME && \
    rm /tmp/openjdk.tar.gz && \
    update-alternatives --install /usr/bin/java java $JAVA_HOME/bin/java 1 && \
    update-alternatives --install /usr/bin/javac javac $JAVA_HOME/bin/javac 1

# ✅ Install SonarScanner CLI
RUN wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip && \
    unzip sonar-scanner-cli-*.zip -d /opt && \
    ln -s /opt/sonar-scanner-*/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm sonar-scanner-cli-*.zip

ENV SONAR_SCANNER_OPTS="-server"