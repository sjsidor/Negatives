#!/bin/bash
set -e

# Configuration
PROJECT_ID="negatives-app"
BUCKET_NAME="www.sjsidor.com"
REGION="us-central1"
DOMAIN="sjsidor.com"

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable storage.googleapis.com
gcloud services enable compute.googleapis.com

# Create Cloud Storage bucket
echo "Creating Cloud Storage bucket..."
gsutil mb -p $PROJECT_ID -l $REGION gs://$BUCKET_NAME || true

# Configure bucket for website hosting
echo "Configuring bucket for website hosting..."
gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Create load balancer backend bucket
echo "Creating backend bucket..."
gcloud compute backend-buckets create $BUCKET_NAME \
  --gcs-bucket-name=$BUCKET_NAME \
  --enable-cdn || true

# Create SSL certificate
echo "Creating SSL certificate..."
gcloud compute ssl-certificates create $DOMAIN-cert \
  --domains=$DOMAIN,www.$DOMAIN \
  --global || true

# Create URL map
echo "Creating URL map..."
gcloud compute url-maps create $DOMAIN-urlmap \
  --default-backend-bucket=$BUCKET_NAME || true

# Create target HTTPS proxy
echo "Creating target HTTPS proxy..."
gcloud compute target-https-proxies create $DOMAIN-https-proxy \
  --url-map=$DOMAIN-urlmap \
  --ssl-certificates=$DOMAIN-cert || true

# Create forwarding rules
echo "Creating forwarding rules..."
gcloud compute forwarding-rules create $DOMAIN-https \
  --global \
  --target-https-proxy=$DOMAIN-https-proxy \
  --ports=443 || true

gcloud compute forwarding-rules create $DOMAIN-http \
  --global \
  --target-http-proxy=$DOMAIN-http-proxy \
  --ports=80 || true

echo "Setup complete! Now you need to:"
echo "1. Configure your domain's DNS settings to point to the load balancer IP"
echo "2. Wait for the SSL certificate to be provisioned"
echo "3. Deploy your frontend code using the GitHub Actions workflow" 