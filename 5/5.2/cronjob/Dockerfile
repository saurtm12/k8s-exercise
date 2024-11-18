# Stage 1: Use Alpine to install curl
FROM postgres:13
WORKDIR /app/cronjob

COPY ./entrypoint.sh /app/cronjob
RUN chmod +x /app/cronjob/entrypoint.sh

RUN apt-get update && apt-get install -y curl gnupg \
    && echo "deb [signed-by=/usr/share/keyrings/google-keyring.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list \
    && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/google-keyring.gpg \
    && apt-get update && apt-get install -y google-cloud-sdk \
    && apt-get clean
# Define the command to run curl with the POST request
CMD ["./entrypoint.sh"]