#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
SERVICE_ACCOUNT_KEY="/credentials/key.json"
BACKUP_FILE="/backup/db_backup.sql"

mkdir -p /backup
# Check if the GCS_BUCKET environment variable is set
if [[ -z "$GCS_BUCKET" ]]; then
  echo "Environment variable GCS_BUCKET is not set. Exiting..."
  exit 1
fi

# Check if the key file exists
if [[ ! -f "$SERVICE_ACCOUNT_KEY" ]]; then
  echo "Service account key file not found at $SERVICE_ACCOUNT_KEY"
  exit 1
fi

pg_dump -h $POSTGRES_SERVICE -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_FILE

# Check if the backup file exists
if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found at $BACKUP_FILE"
  exit 1
fi


# Authenticate with Google Cloud
echo "Authenticating with Google Cloud..."
gcloud auth activate-service-account --key-file="$SERVICE_ACCOUNT_KEY"

# Check if authentication was successful
if [[ $? -ne 0 ]]; then
  echo "Google Cloud authentication failed"
  exit 1
fi

# Upload the backup file to the specified GCS bucket
echo "Uploading backup to GCS bucket: $GCS_BUCKET..."
gsutil cp "$BACKUP_FILE" "gs://$GCS_BUCKET/db_backup_$(date +%Y-%m-%d-%H-%M).sql"

if [[ $? -eq 0 ]]; then
  echo "Backup uploaded successfully to gs://$GCS_BUCKET/db_backup_$(date +%Y-%m-%d).sql"
else
  echo "Failed to upload the backup to GCS"
  exit 1
fi
