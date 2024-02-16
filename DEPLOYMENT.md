# Deployment Guide

## AMI Automation with Packer

Automate the creation of Amazon Machine Images (AMIs) using Packer to streamline your deployment process.

### Steps:

1. **Install Packer**  
   Follow the installation instructions at [HashiCorp Packer](https://developer.hashicorp.com/packer/tutorials/aws-get-started/get-started-install-cli).

2. **Configure Packer Template**  
   In `aws-ubuntu.pkr.hcl`, update the source within the build object and provisioner file to match the absolute path of the `dist` folder. Change `ami_name` to a unique value if you've used this file before (and change it each time).

3. **Initialize Packer**  
   If this is your first time using this HCL file, run:

   ```
   packer init .
   ```

4. **Export AWS Credentials**  
   Set your AWS credentials in the CLI environment:

   ```
   export AWS_ACCESS_KEY_ID="<YOUR_AWS_ACCESS_KEY_ID>"
   export AWS_SECRET_ACCESS_KEY="<YOUR_AWS_SECRET_ACCESS_KEY>"
   ```

5. **Create AMI**  
   Execute:
   ```
   npm run packer
   ```
   The output will be the AMI image ID.

## Deployment Options

### Option 1: EC2

For an automated and secure deployment option using EC2:

1. **Set Up AWS CLI**  
   Install AWS CLI and configure it with your AWS credentials.

2. **Update YAML**
   Inside cloudFormationDeploy.yaml, update ImageId field with new AMI produced from Packer

3. **Install Dependencies**  
   Run:

   ```
   npm install
   ```

4. **Deploy**  
   Execute:

   ```
   npm run deploy
   ```

   This command creates and runs a CloudFormation stack, which sets up necessary security groups and deploys an EC2 instance with your server running. After all steps are completed, go to EC2 IPv4 address add port 3000 to the end and remove the “s” from “http” (e.g. http://ec2-3-144-128-131.us-east-2.compute.amazonaws.com:3000/ )

   **Note:** Ensure the stack name is unique each time you deploy by adjusting it in `package.json` under `npm run deploy`.

### Option 2: Fargate via ECR

Deploy using ECS with Fargate for a scalable option:

- **Advantages:** Easy updates roll-out.
- **Disadvantages:** Setup time and complexity.

**Security Group Details:**  
Allow HTTP/S traffic from your IP addresses.

**IAM Role Details:**  
An EC2 Role permitting Lambda Full Access.

**ECR Image URI:**  
`public.ecr.aws/k9x5s2b8/aa-test:latest`

### Option 3: Local Deployment

Quick and easy setup for local development:

1. Install dependencies:
   ```
   npm install
   ```
2. Start the application:
   ```
   npm run all
   ```

Choose the option that best suits your deployment needs and follow the steps for a smooth and efficient setup.
