#!/usr/bin/env bash

# Simple bash script for making dealing with the weird git permissions issue on GCP more convenient
# Automatically changes file permissions then pulls updates

# Exit bash script on error
set -e

# Change ownership of files
USER=$(whoami)
sudo chown -R $USER:$USER .

git pull
