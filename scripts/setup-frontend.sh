#!/bin/bash

# Exit on error
set -e

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud SDK is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="get(account)" &> /dev/null; then
    echo "Please authenticate with Google Cloud first:"
    echo "gcloud auth login"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "No project ID set. Please set it first:"
    echo "gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "Setting up GCP resources for project: $PROJECT_ID"

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable storage.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com

# Create Cloud Storage bucket
BUCKET_NAME="www.sjsidor.com"
echo "Creating Cloud Storage bucket: $BUCKET_NAME"
gsutil mb -p $PROJECT_ID -l us-central1 gs://$BUCKET_NAME

# Configure bucket for website hosting
echo "Configuring bucket for website hosting..."
gsutil web set -m index.html gs://$BUCKET_NAME

# Set bucket permissions
echo "Setting bucket permissions..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Create service account
SA_NAME="frontend-deployer"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
echo "Creating service account: $SA_EMAIL"
gcloud iam service-accounts create $SA_NAME \
    --display-name="Frontend Deployer" \
    --description="Service account for deploying frontend to Cloud Storage"

# Grant service account permissions
echo "Granting service account permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.objectViewer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.objectCreator"

# Create and download service account key
echo "Creating service account key..."
gcloud iam service-accounts keys create key.json \
    --iam-account=$SA_EMAIL

echo "Setup complete! Please add the following secrets to your GitHub repository:"
echo "1. GCP_PROJECT_ID: $PROJECT_ID"
echo "2. GCP_BUCKET_NAME: $BUCKET_NAME"
echo "3. GCP_SA_KEY: (contents of key.json)" 