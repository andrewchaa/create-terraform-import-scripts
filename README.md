# create-terraform-import-scripts


```
node write-imports.js :state_file, :plan_file :tf_module_directory :env :region
node write-imports.js ./state.tfstate ./dev-plan.txt api dev eu-west-1
```

It reads the terraform state file and the plan file and then generate import scripts which you can run.

The format of the plan file is like this.

```
aws_apigatewayv2_api_mapping.api
aws_apigatewayv2_api_mapping.geo
aws_apigatewayv2_api_mapping.regional
aws_apigatewayv2_authorizer.authorizer
aws_apigatewayv2_authorizer.health_check_authorizer
aws_apigatewayv2_domain_name.api
aws_apigatewayv2_domain_name.geo
aws_apigatewayv2_domain_name.regional
```
