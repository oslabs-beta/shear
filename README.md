# Shear

## Table of Contents

- [About](#about)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## About

Shear is an AWS Lambda cost optimization tool designed to help you find the ideal balance between function runtime, memory usage, and cost efficiency. You can provide a Lambda function ARN as input, and Shear will invoke that function with multiple power configurations. It then analyzes the execution logs to suggest the best power configuration to minimize cost and/or maximize performance. It also supports concurrent invocations of the function for enhanced analysis.

Please note that the input function will be executed in your AWS account.

## Inputs

Typical input format:

- Lambda ARN: `arn:aws:lambda:us-west-1:066290895578:function:testFunction`
- Lambda Payload: `{"testFunctionParam1":3, "testFunctionParam2":2000, "testFunctionParam3":40}`
- Memory Allocation:
  - Minimum (MB): 128
  - Maximum (MB): 4096
- Memory Intervals: 5
- Test Volume: 25
- Concurrency: True

## Outputs

The expected output is a graph showing the relationship between memory, time, and cost.
If concurrency is enabled, an additional graph will be provided, displaying the same data but with fine-tuned power values.

## Local Development

To get started with local development, install dev dependencies with `npm install`. To run the server and client concurrently, use `npm run all`.

## Deployment

Three deployment options are available:

- Option 1: AWS CloudFormation/HashiCorp Packer
- Option 2: AWS Fargate via ECR
- Option 3: Local

For a detailed deployment breakdown, click [here](DEPLOYMENT.md).

## Contributing

Shear welcomes contributions from the open source community. Submit Issues on GitHub to report bugs or suggest enhancements. To contribute code, fork this repo, commit your changes, and submit a Pull Request following our template. Follow Shear on [LinkedIn](https://www.linkedin.com/company/shearlambda) for updates.

### Encouraged Features

- Saving analyzed functions to DB
- Show ΔPerformance/ΔCost - interpolate data to curve, take derivative
- Automatic optimizations via cron job (EventBridge)

### Known Bugs

## Authors

- Albert Hu | [GitHub](https://github.com/albhu24) | [LinkedIn](https://www.linkedin.com/in/hu-albert/)
- Ari Anguiano | [Github](https://github.com/crispulum) | [LinkedIn](https://www.linkedin.com/in/ari-anguiano)
- Caleb Kao | [GitHub](https://github.com/caleb-kao) | [LinkedIn](https://www.linkedin.com/in/calebkao/)
- Dinesh Wijesekara | [GitHub](https://github.com/Dwijesek) | [LinkedIn](https://www.linkedin.com/in/dinesh-wijesekara-a14b96251/)
- Jonathan Kim | [GitHub](https://github.com/jonbingkim) | [LinkedIn](https://www.linkedin.com/in/jonbkim)

## License

Distributed under the MIT License. See [LICENSE.txt](LICENSE.txt) for more information.
