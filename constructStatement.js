import clipboardy from 'clipboardy'
import _ from 'lodash'

export default function constructStatement(
    importCmd,
    region,
    state,
    address
    ) {

    const commands = []

    const parseAddress = (address) => {
        const parts = address
            .replace(/\[.+\]/, '')
            .split('.')
        if (parts.length == 2) {
            return ['', parts[0], parts[1]]
        }

        return [
            `${parts[0]}.${parts[1]}`,
            parts[2],
            parts[3]
        ]
    }

    const getResource = (resources, region, module, type, name) => {
        if (module) {
            return _.find(resources, (x) => {
                return x.module &&
                  x.module == `module.${region}.${module}` &&
                  x.type == type &&
                  x.name == name
            })
        }

        return _.find(resources, (x) => {
            return x.module &&
              x.module == `module.${region}` &&
              x.type == type &&
              x.name == name
        })
    }

    function escape(value) {
        return value.replace('$', '\\$')
    }

    const [module, type, name] = parseAddress(address)
    const resource = getResource(state.resources, region, module, type, name)

    const instances = resource.instances
    const modulePrefix = resource.module.split('.').length > 2
        ? resource.module.replace(`module.${region}.`, '') + '.'
        : ''

    const resourceAddr = `${modulePrefix}${type}.${name}`
    const getKey = (key) => key
        ? typeof key === 'number'
            ? `[${key}]`
            : `["${key}"]`
        : ''

    _.forEach(instances, (x) => {
        switch (type) {
            case 'aws_acm_certificate_validation':
                break
            case 'aws_apigatewayv2_api_mapping':
                commands.push(`${importCmd} '${resourceAddr}${getKey(x.index_key)}' "${x.attributes.id}/${x.attributes.domain_name}"`)
                break
            case 'aws_apigatewayv2_stage':
                commands.push(`${importCmd} '${resourceAddr}${getKey(x.index_key)}' "${x.attributes.api_id}/${escape(x.attributes.name)}"`)
                break
            case 'aws_cloudwatch_log_metric_filter':
                commands.push(`${importCmd} '${resourceAddr}${getKey(x.index_key)}' "${x.attributes.log_group_name}:${x.attributes.name}"`)
                break
            case 'aws_iam_role_policy_attachment':
                commands.push(`${importCmd} '${resourceAddr}${getKey(x.index_key)}' "${x.attributes.role}/${x.attributes.policy_arn}"`)
                break
            case 'aws_lambda_permission':
                commands.push(`${importCmd} '${resourceAddr}${getKey(x.index_key)}' "${x.attributes.function_name}/${x.attributes.statement_id}"`)
                break
            case 'aws_apigatewayv2_authorizer':
            case 'aws_apigatewayv2_integration':
            case 'aws_apigatewayv2_route':
                commands.push(`${importCmd} '${resourceAddr}${getKey(x.index_key)}' "${x.attributes.api_id}/${x.attributes.id}"`)
                break
            case 'aws_cloudwatch_metric_alarm':
                commands.push(`${importCmd} '${resourceAddr}${getKey(x.index_key)}' "${x.attributes.alarm_name}"`)
                break

            default:
                commands.push(`${importCmd} '${resourceAddr}${getKey(x.index_key)}' "${x.attributes.id}"`)
                break
        }

    })

    return commands
}
