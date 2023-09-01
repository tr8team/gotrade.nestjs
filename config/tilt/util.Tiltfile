def helm_watch(landscape, platform, service, t):

    ns = platform
    release = platform + "-" + service

    extraVals = []
    if t == 'local':
        extraVals = [
            'tags.active=false',
            'tags.local=true',
        ]
    elif t == 'cluster':
        extraVals = [
            'tags.active=true',
            'tags.local=false',
        ]
    else:
        fail('Unknown type: ' + t)


    watch_file('infra/root_chart')
    watch_file('infra/api_chart')
    watch_file('infra/migration_chart')

    local_resource(
        'update-build-helm',
        cmd='helm dependency update ./infra/root_chart',
        deps=[
            './infra/**/*.*',
        ]
    )

    local_resource(
        'sync-configuration',
        cmd='./scripts/config-sync.sh',
        deps = [
            './config/app/**/*.*',
        ]
    )

    k8s_yaml(
        helm('./infra/root_chart',
            name = release,
            namespace = ns,
            values = [
                './infra/root_chart/values.yaml',
                './infra/root_chart/values.' + landscape + '.yaml',
            ],
            set = extraVals
        )
    )
