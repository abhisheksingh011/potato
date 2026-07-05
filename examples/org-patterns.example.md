# Org Architecture Patterns — starter template

Import this file via **AI Import → 📎 Import .md rules** to have every generated
diagram follow your organization's standards. Replace the example rules below
with your own. One rule per line, plain imperative sentences work best. Headings
and blank lines are fine — they're passed through to the LLM as context.

## Approved & forbidden services
- Standardize on Aurora PostgreSQL for relational data. Do not use DynamoDB unless the user explicitly asks.
- Object storage is always Amazon S3 with default encryption (SSE-KMS) enabled.
- Container workloads run on ECS Fargate. Do not introduce self-managed EC2 clusters.

## Identity & security
- All public ingress must pass through AWS WAF, then an Application Load Balancer. Never expose compute directly to the internet.
- Authentication is always Amazon Cognito plus a custom authorizer Lambda. Never rely on IAM-only auth for user-facing APIs.
- Place all data and compute tiers in private subnets. Only the ALB/API Gateway sits in a public subnet.

## Mandatory components
- Every diagram includes the central logging account as a CloudWatch/monitoring destination (dotted monitoring arrows).
- Every stateful service shows encryption at rest and a backup/DR path.

## Naming conventions
- Prefix every service name with `acme-<env>-` (e.g. `acme-prod-orders`, `acme-stage-auth`).
- Group nodes by trust boundary: Region > VPC > Availability Zone > public/private subnet.
